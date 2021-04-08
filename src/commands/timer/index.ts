/**
 * Discord Debate Timer
 *
 * @license BSD-3-Clause
 * @version 1.8.0
 * @author Luke Zhang luke-zhang-04.github.io/
 * @copyright 2020 - 2021 Luke Zhang
 */

import type {Message, User} from "discord.js"
import {formatTime, muteUser} from "./utils"
import DatePlus from "@luke-zhang-04/dateplus/dist/cjs/dateplus.cjs"
import {verbosity} from "../../getConfig"

/* eslint-disable no-use-before-define */

/**
 * Timers get pushed here This keeps track of running timers To kill a timer, the kill() function
 * should be called
 */
export const timers: {[key: number]: Timer} = {}

/* eslint-enable no-use-before-define */

const enum Values {
    /**
     * How often the timer should update in seconds 5 seconds is fine because of server latency
     * Anything smaller might cause issues
     */
    Interval = 5,

    /**
     * Grace time before a speech in seconds
     */
    GraceTime = 15,
}

export class Timer {
    /**
     * If user should be muted after their speech temporarily (experimental)
     */
    public shouldMute = true

    /**
     * If timer is currently paused
     */
    public isPaused = false

    /**
     * Uid of mentioned user if provided
     */
    public readonly mentionedUid?: string

    /**
     * Creator of timer
     */
    public readonly creator: User

    /**
     * Timer length
     */
    public readonly timeCtrl: number

    /**
     * Protected time in seconds
     */
    public readonly protectedTime: number

    /**
     * Real start time which is readonly
     */
    private readonly _trueStartTime = Date.now()

    /**
     * Keep track of this message, as we're going to consantly edit it and change it's time
     */
    private readonly _msg: Promise<Message>

    /**
     * Stages of speech
     */
    private readonly _stages = {
        1: false, // 30 seconds in - protected time
        2: false, // 2:30 minutes in - halfway through
        3: false, // 4:30 minutes in - protected time
        4: false, // 5:00 minutes in - grace time begins
        5: false, // 5:15 minutes in - speech is over
    }

    /**
     * User object from mentioned user
     */
    private readonly _mentionedUser?: User

    /**
     * Current time in seconds
     */
    private _time = 0

    /**
     * Id of interval
     */
    private _intervalId: NodeJS.Timeout | null = null

    /**
     * Width of the progress bar
     */
    private readonly _barWidth = 60

    /**
     * Started time, which can be changed if paused
     */
    private _startTime = Date.now()

    public constructor(
        private readonly _fakeId: number,
        public readonly message: Message,
        timeCtrl: number,
    ) {
        this._mentionedUser = message.mentions.users.first() // Mentioned user
        this.mentionedUid = this._mentionedUser?.id // Id of aforementioned user
        this.creator = message.author

        const uid = this.mentionedUid

        // Make sure timer isn't longer than 15 mins
        this.timeCtrl = isNaN(timeCtrl) ? DatePlus.minsToSecs(5) : timeCtrl

        this.protectedTime = this.timeCtrl >= DatePlus.minsToSecs(7) ? 60 : 30

        message.channel.send(`:timer: Starting timer${uid ? ` for debater <@${uid}>` : ""}!`)

        const timerTarget = this.mentionedUid ? `For: <@${this.mentionedUid}>\n` : ""
        const bar =
            process.env.NODE_ENV === "test" ? "" : `\`[${"\u2014".repeat(this._barWidth)}]\` 0%\n` // Progress bar, with "EM DASH" character —

        this._msg = message.channel.send(
            `${bar}${timerTarget}Started by: ${this.creator}\nCurrent time: ${formatTime(
                this.time,
            )}\nEnd time: ${formatTime(this.timeCtrl)}\nId: ${this._fakeId ?? "unknown"}${
                this.isPaused ? "\nPaused" : ""
            }`,
        )
    }

    public get time(): number {
        return this._time
    }

    public get fakeId(): number {
        return this._fakeId
    }

    public get startTime(): number {
        return this._startTime
    }

    /**
     * Changes the current time of this timer by changing the start time
     *
     * @param amt - Amount to wind FORWARD by
     */
    public async changeTime(amt: number): Promise<void> {
        this._startTime -= amt * 1000 // Wind the start time the opposite direction

        const now = Date.now()

        /**
         * If removed time causes negative time, make it 0 If added time causes more than 5:15, make it 5:15
         */
        if (this._startTime > now) {
            this._startTime = now
        } else if (this._startTime < now - (this.timeCtrl + Values.GraceTime) * 1000) {
            this._startTime = now - (this.timeCtrl + Values.GraceTime) * 1000
        }

        await this._updateStatus()

        const {_time: time, timeCtrl} = this

        if (time < timeCtrl + Values.GraceTime && this._stages[5]) {
            // Grace time
            this._stages[5] = false
        }
        if (time < timeCtrl && this._stages[4]) {
            // End of speech
            this._stages[4] = false
        }
        if (time < timeCtrl - this.protectedTime && this._stages[3]) {
            // Ending protected time
            this._stages[3] = false
        }
        if (time < timeCtrl / 2 && this._stages[2]) {
            // Halfway
            this._stages[2] = false
        }
        if (time < this.protectedTime && this._stages[1]) {
            // Starting procteded
            this._stages[1] = false
        }
    }

    /**
     * Start the timer and interval
     */
    public start(): void {
        this._intervalId = setInterval(() => {
            if (this.isPaused) {
                this._startTime += Values.Interval * 1000

                if (Date.now() - this._trueStartTime > DatePlus.minsToMs(20)) {
                    this.message.channel.send(
                        `Timer with id ${this._fakeId} has been paused for more than 20 minutes. This timer is now being killed.`,
                    )

                    this.shouldMute = false
                    this.kill()
                }

                return
            }

            this._updateStatus()

            // If speech surpasses time
            if (
                this.time >= this.timeCtrl + Values.GraceTime ||
                this.time > DatePlus.minsToSecs(20)
            ) {
                this.kill(false)
            }
        }, Values.Interval * 1000)
    }

    /**
     * Kills this timer and removes it from the timer list End of life for this timer. Once this is
     * called, the timer is gone.
     *
     * @param sendMsg - If "killed timer" message should be sent to channel
     */
    public async kill(sendMsg = true): Promise<void> {
        if (this._intervalId !== null) {
            clearInterval(this._intervalId)
        }

        if (this._mentionedUser !== undefined && this.shouldMute) {
            muteUser(this.message.guild, this._mentionedUser)
        }

        if (verbosity === 2 && sendMsg) {
            this.message.channel.send(`Killed timer with id ${this._fakeId}.`)
        }

        ;(await this._msg).edit(
            `:white_check_mark: Speech Finished at \`${formatTime(
                DatePlus.msToSeconds(Date.now() - this._trueStartTime).seconds,
                true,
            )}\`!`,
        )

        if (this._fakeId !== undefined) {
            Reflect.deleteProperty(timers, this._fakeId)
        }
    }

    /**
     * Control resume or pause state of timer
     *
     * @param playOrPause - If the timer should resume or pause
     */
    public playPause(playOrPause?: "resume" | "pause"): void {
        this.isPaused = playOrPause === undefined ? !this.isPaused : playOrPause === "pause"
    }

    /**
     * Update the message with the current time
     */
    private async _updateStatus(): Promise<void> {
        const msg = await this._msg
        const {_barWidth: barWidth, timeCtrl} = this

        // Subtract current time from start time and round to nearest second
        this._time = Math.round((Date.now() - this._startTime) / 1000)

        // Mentioned user id
        const timerTarget = this.mentionedUid ? `For: <@${this.mentionedUid}>\n` : ""

        /**
         * Progress bar
         */
        // Number of ticks so far
        const elapsedTicks = Math.floor(this._time / (timeCtrl / barWidth))

        // Blocks and dashes for bar
        const blocks = "\u2588".repeat(Math.min(elapsedTicks, barWidth))
        const dashes = "\u2014".repeat(Math.min(Math.max(barWidth - elapsedTicks, 0), barWidth))

        /**
         * Percentage of the speech that is complete
         */
        const percentage = Math.min(Math.round((this._time / timeCtrl) * 1000) / 10, 100)

        // Progress bar with █ and —
        const bar =
            process.env.NODE_ENV === "test" // Ignore if testing
                ? ""
                : `\`[${blocks}${dashes}]\` ${percentage}%\n`

        msg.edit(
            // Edit the message with required information
            `${bar}${timerTarget}Started by: ${this.creator}\nCurrent time: ${formatTime(
                this.time,
            )}\nEnd time: ${formatTime(this.timeCtrl)}\nId: ${this._fakeId ?? "unknown"}${
                this.isPaused ? "\nPaused" : ""
            }`,
        )

        this._notifySpeechStatus()
    }

    /**
     * Sends a message to the channel to notify everyone that an important time has passed, such as
     * protected times
     */
    private _notifySpeechStatus(): void {
        // Tagged user to notify
        const userTag = this.mentionedUid ? `<@${this.mentionedUid}>` : ""
        const {channel} = this.message
        const {time, timeCtrl} = this

        // 3 minute speechs are all protected
        const hasProtectedTime = this.timeCtrl > DatePlus.minsToSecs(3)

        // The messages can be used as comments they're kinda self explanatory
        if (!this._stages[1] && hasProtectedTime && time >= this.protectedTime) {
            const showTime = formatTime(this.protectedTime, true)

            this._stages[1] = true
            channel.send(
                `${userTag} timer ${this._fakeId} - **${showTime}** - Protected time is over!`,
            )
        }
        if (!this._stages[2] && time >= timeCtrl / 2) {
            const showTime = formatTime(timeCtrl / 2)

            this._stages[2] = true
            channel.send(
                `${userTag} timer ${this._fakeId} - **${showTime}** - You're halfway through your speech!`,
            )
        }
        if (!this._stages[3] && hasProtectedTime && time >= timeCtrl - this.protectedTime) {
            const showTime = formatTime(timeCtrl - this.protectedTime)

            this._stages[3] = true
            channel.send(
                `${userTag} timer ${this._fakeId} - **${showTime}** - Protected time! Your speech is almost over!`,
            )
        }
        if (!this._stages[4] && time >= timeCtrl) {
            const showTime = formatTime(timeCtrl)

            this._stages[4] = true
            channel.send(
                `${userTag} timer ${this._fakeId} - **${showTime}** - Wrap it up! You have ${Values.GraceTime} seconds.`,
            )
        }
        if (!this._stages[5] && time >= timeCtrl + Values.GraceTime) {
            const showTime = formatTime(timeCtrl + Values.GraceTime)

            this._stages[5] = true
            channel.send(
                `${userTag} timer ${this._fakeId} - **${showTime}** - Your speech is over!`,
            )

            if (verbosity === 2 && Math.random() >= 0.9) {
                channel.send(
                    "BTW, I don't use exclamation marks because I'm excited, I'm just forced to.",
                )
            }
        }
    }
}

export {resume, pause} from "./playPause"
export {default as changeTime} from "./changeTime"
export {kill} from "./kill"
export {cmd as list} from "./list"
export {start} from "./start"

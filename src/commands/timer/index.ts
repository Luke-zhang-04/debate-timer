/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.3.0
 * @license BSD-3-Clause
 */

import type {Message, User} from "discord.js"
import {formatTime, muteUser, nextKey} from "./utils"
import {maxTimers, maxTimersPerUser} from "../../getConfig"
import DatePlus from "@luke-zhang-04/dateplus"

/* eslint-disable no-use-before-define */

/**
 * Timers get pushed here
 * This keeps track of running timers
 * To kill a timer, the kill() function should be called
 */
export const timers: {[key: number]: Timer} = {}

/* eslint-enable no-use-before-define */

/**
 * How often the timer should update in seconds
 * 5 seconds is fine because of server latency
 * Anything smaller might cause issues
 */
const interval = 5

export class Timer {

    /**
     * If user should be muted after their speech temporarily (experimental)
     */
    public shouldmute = true

    /**
     * If timer is currently paused
     */
    public ispaused = false

    /**
     * Uid of mentioned user if provided
     */
    public readonly mentionedUid?: string

    /**
     * Creator of timer
     */
    public readonly creator: User

    /**
     * Real start time which is readonly
     */
    private readonly _trueStartTime = Date.now()

    /**
     * Keep track of this message, as we're going to consantly edit it and
     * change it's time
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
     * Started time, which can be changed if paused
     */
    private _startTime = Date.now()

    public constructor (
        private readonly _fakeId: number,
        public readonly message: Message,
    ) {
        this._mentionedUser = message.mentions.users.first() // Mentioned user
        this.mentionedUid = this._mentionedUser?.id // Id of aforementioned user
        this.creator = message.author

        const uid = this.mentionedUid

        message.channel.send(`:timer: Starting timer${uid ? ` for debater <@${uid}>` : ""}!`)

        const timerTarget = this.mentionedUid ? `For: <@${this.mentionedUid}>\n` : ""
        const bar = process.env.NODE_ENV === "test"
            ? ""
            : `\`[${"\u2014".repeat(60)}]\` 0%\n` // Progress bar, with "EM DASH" character —

        this._msg = message.channel.send(
            `${bar}${timerTarget}Started by: ${this.creator}\nCurrent time: ${formatTime(this.time)}\nId: ${this._fakeId ?? "unknown"}${this.ispaused ? "\nPaused" : ""}`,
        )
    }

    public get time (): number {
        return this._time
    }

    public get fakeId (): number {
        return this._fakeId
    }

    public get startTime (): number {
        return this._startTime
    }

    /**
     * Changes the current time of this timer by changing the start time
     * @param amt - amount to wind FORWARD by
     */
    public changeTime = async (amt: number): Promise<void> => {
        this._startTime -= amt * 1000 // Wind the start time the opposite direction

        const now = Date.now()

        /**
         * If removed time causes negative time, make it 0
         * If added time causes more than 5:15, make it 5:15
         */
        if (this._startTime > now) {
            this._startTime = now
        } else if (this._startTime < now - DatePlus.minsToMs(5.25)) {
            this._startTime = now - DatePlus.minsToMs(5.25)
        }

        console.log(DatePlus.minsToMs(5.25))

        await this._updateStatus()

        const {_time: time} = this

        if (time < 300 && this._stages[4]) {
            this._stages[4] = false
        } if (time < 270 && this._stages[3]) {
            this._stages[3] = false
        } if (time < 150 && this._stages[2]) {
            this._stages[2] = false
        } if (time < 30 && this._stages[1]) {
            this._stages[1] = false
        }
    }

    /**
     * Start the timer and interval
     */
    public start = async (): Promise<void> => {
        this._intervalId = setInterval(() => {
            if (this.ispaused) {
                this._startTime += interval * 1000

                if (Date.now() - this._trueStartTime > DatePlus.minsToMs(15)) {
                    this.message.channel.send(`Timer with id ${this._fakeId} has been paused for more than 15 minutes. This timer is now being killed.`)

                    this.shouldmute = false
                    this.kill()
                }

                return
            }

            this._updateStatus()

            // If speech surpasses 320 seconds (5 minutes 15 seconds)
            if (this.time >= 315 || this.time > DatePlus.minsToMs(15)) {
                this.kill(false)
            }
        }, interval * 1000)
    }

    /**
     * Kills this timer and removes it from the timer list
     * End of life for this timer. Once this is called, the timer is gone.
     * @param sendMsg - if "killed timer" message should be sent to channel
     */
    public kill = async (sendMsg = true): Promise<void> => {
        if (this._intervalId !== null) {
            clearInterval(this._intervalId)
        }

        if (this._mentionedUser !== undefined && this.shouldmute) {
            muteUser(this.message.guild, this._mentionedUser)
        }

        if (sendMsg) {
            this.message.channel.send(`Killed timer with id ${this._fakeId}.`)
        }

        (await this._msg).edit(`:white_check_mark: Speech Finished!`)

        if (this._fakeId !== undefined) {
            Reflect.deleteProperty(timers, this._fakeId)
        }
    }

    /**
     * Control resume or pause state of timer
     * @param playOrPause - if the timer should resume or pause
     */
    public playPause = (playOrPause?: "resume" | "pause"): void => {
        this.ispaused = playOrPause === undefined
            ? !this.ispaused
            : playOrPause === "pause"
    }

    private _updateStatus = async (): Promise<void> => {
        const msg = await this._msg

        // Subtract current time from start time and round to nearest second
        this._time = Math.round((Date.now() - this._startTime) / 1000)

        // Mentioned user id
        const timerTarget = this.mentionedUid ? `For: <@${this.mentionedUid}>\n` : ""

        // Progress bar
        const elapsedTicks = Math.floor(this._time / 5)
        const blocks = "\u2588".repeat(Math.min(elapsedTicks, 60))
        const dashes = "\u2014".repeat(Math.min(Math.max(60 - elapsedTicks, 0), 60))
        const percentage =
            Math.min(Math.round(this._time / 300 * 1000) / 10, 100)

        // Progress bar with █ and —
        const bar = process.env.NODE_ENV === "test"
            ? ""
            : `\`[${blocks}${dashes}]\` ${percentage}%\n`

        msg.edit(
            `${bar}${timerTarget}Started by: ${this.creator}\nCurrent time: ${formatTime(this.time)}\nId: ${this._fakeId ?? "unknown"}${this.ispaused ? "\nPaused" : ""}`,
        )

        this._notifySpeechStatus()
    }

    /**
     * Sends a message to the channel to notify everyone that an important time
     * has passed, such as protected times
     */
    private _notifySpeechStatus = (): void => {
        const userTag = this.mentionedUid ? `<@${this.mentionedUid}>` : ""
        const {channel} = this.message
        const {time} = this

        if (!this._stages[1] && time >= 30) {
            this._stages[1] = true
            channel.send(`${userTag} timer ${this._fakeId} - **0:30** - Protected time is over!`)
        } if (!this._stages[2] && time >= 150) {
            this._stages[2] = true
            channel.send(`${userTag} timer ${this._fakeId} - **2:30** - You're halfway through your speech!`)
        } if (!this._stages[3] && time >= 270) {
            this._stages[3] = true
            channel.send(`${userTag} timer ${this._fakeId} - **4:30** - Protected time! Your speech is almost over!`)
        } if (!this._stages[4] && time >= 300) {
            this._stages[4] = true
            channel.send(`${userTag} timer ${this._fakeId} - **5:00** - Wrap it up! You have 15 seconds of grace time.`)
        } if (time >= 315) {
            channel.send(`${userTag} timer ${this._fakeId} - **5:15** - Your speech is over!`)
        }
    }

}

/**
 * Checks if one user has exceeded the number of timers that can be run
 * @param user - user object
 * @returns {boolean} if user has exceeded the limit
 */
const userTimersExceeded = (user: User): boolean => {
    let timerCount = 0

    for (const timer of Object.values(timers)) {
        if (timer.creator.id === user.id) {
            timerCount ++
        }

        // Break the loop early if possible
        if (timerCount >= maxTimersPerUser) {
            return true
        }
    }

    return timerCount >= maxTimersPerUser
}

/**
 * Start a new timer in background
 * @param message - message object
 * @returns Promise<void>
 */
export const start = (message: Message): void => {
    if (Object.keys(timers).length >= maxTimers) { // Max number of timers reached
        message.channel.send(`A maximum of ${maxTimers} are allowed to run concurrently. Since this bot is hosted on either some crappy server or Luke's laptop, running too many concurrent tasks isn't a great idea. The max timer count can be changed in the configuration file.`)

        return
    } else if (userTimersExceeded(message.author)) {
        message.channel.send(`A maximum of ${maxTimersPerUser} are allowed for one user. Why tf do you even need ${maxTimersPerUser} at once? The max timers per user count can be changed in the configuration file.`)

        return
    }

    const fakeId = nextKey(Object.keys(timers).map((id) => Number(id)))
    const timer = new Timer(fakeId, message)

    timer.start()

    timers[fakeId] = timer
}

export default start

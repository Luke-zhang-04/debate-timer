/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.5.0
 * @license BSD-3-Clause
 */

import type {Message, User} from "discord.js"
import {defaultTimeCtrl, maxTimers, maxTimersPerUser} from "../../getConfig"
import DatePlus from "@luke-zhang-04/dateplus/dist/cjs/dateplus.cjs"
import {Timer} from "."
import {nextKey} from "./utils"


/**
 * Checks if one user has exceeded the number of timers that can be run
 * @param user - user object
 * @returns {boolean} if user has exceeded the limit
 */
const userTimersExceeded = (
    user: User,
    timers: {[key: number]: Timer},
): boolean => {
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
export const start = async (message: Message): Promise<void> => {
    const {timers} = await import(".")

    if (maxTimers > -1 && Object.keys(timers).length >= maxTimers) { // Max number of timers reached
        message.channel.send(`A maximum of ${maxTimers} are allowed to run concurrently. The max timer count can be changed in the configuration file.`)

        return
    } else if (userTimersExceeded(message.author, timers)) {
        message.channel.send(`A maximum of ${maxTimersPerUser} are allowed for one user. Why tf do you even need ${maxTimersPerUser} at once? The max timers per user count can be changed in the configuration file.`)

        return
    }

    // Fake id given to the user
    const fakeId = nextKey(Object.keys(timers).map((id) => Number(id)))

    // User defined time control (e.g 5 mins)
    const timeCtrl = message.content.split(" ")
        .filter((content) => !isNaN(Number(content)))
        .map((val) => Number(val))[0] ?? defaultTimeCtrl

    if (!isNaN(timeCtrl) && timeCtrl > 15) {
        message.channel.send("Sorry, the longest timer that I can allow is 15 minutes.")

        return
    }

    const timer = new Timer(
        fakeId,
        message,
        DatePlus.minsToSecs(timeCtrl),
    )

    timer.start()

    timers[fakeId] = timer
}

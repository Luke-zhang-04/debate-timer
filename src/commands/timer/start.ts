/**
 * Discord Debate Timer
 *
 * @license BSD-3-Clause
 * @version 1.9.2
 * @author Luke Zhang luke-zhang-04.github.io/
 * @copyright 2020 - 2021 Luke Zhang
 */

import {Timer, timers} from "."
import {count, filterMap} from "../../utils"
import {defaultTimeCtrl, maxTimers, maxTimersPerUser} from "../../getConfig"
import DatePlus from "@luke-zhang-04/dateplus/dist/cjs/dateplus.cjs"
import {nextKey} from "./utils"

/**
 * Checks if one user has exceeded the number of timers that can be run
 *
 * @param user - User object
 * @returns {boolean} If user has exceeded the limit
 */
const userTimersExceeded = (user: User): boolean =>
    count(Object.values(timers), (timer) => timer.creator.id === user.id, maxTimersPerUser + 1) >=
    maxTimersPerUser

const maxTimersPerChannel = 4

/**
 * Checks if one channel has exceeded the number of timers that can be run
 *
 * @param user - User object
 * @returns {boolean} If user has exceeded the limit
 */
const channelTimersExceeded = (channel: TextableChannel): boolean =>
    count(
        Object.values(timers),
        (timer) => timer.message.channel.id === channel.id,
        maxTimersPerChannel + 1,
    ) >= maxTimersPerChannel

/**
 * Start a new timer in background
 *
 * @param message - Message object
 * @returns Promise<void>
 */
export const start = (message: Message): void => {
    if (maxTimers > -1 && Object.keys(timers).length >= maxTimers) {
        // Max number of timers reached
        message.channel.send(
            `A maximum of ${maxTimers} are allowed to run concurrently. The max timer count can be changed in the configuration file.`,
        )

        return
    } else if (userTimersExceeded(message.author)) {
        message.channel.send(
            `A maximum of ${maxTimersPerUser} timers are allowed for one user. Why do you even need ${maxTimersPerUser} timers at once?`,
        )

        return
    } else if (channelTimersExceeded(message.channel)) {
        message.channel.send(
            `A maximum of ${maxTimersPerChannel} timers are allowed for one channel to stay within Discord API limits. Why do you even need ${maxTimersPerChannel} timers in a channel?`,
        )

        return
    }

    // Fake id given to the user
    const fakeId = nextKey(Object.keys(timers).map((id) => Number(id)))

    const numArgs = Array.from(
        filterMap(message.content.split(" "), false, (content) =>
            isNaN(Number(content)) ? false : Number(content),
        ),
    )

    // User defined time control (e.g 5 mins)
    const timeCtrl = numArgs[0] ?? defaultTimeCtrl
    const protectedTime = numArgs[1]

    if (!isNaN(timeCtrl) && timeCtrl > 15) {
        message.channel.send("Sorry, the longest timer that I can allow is 15 minutes.")

        return
    }

    const timer = new Timer(
        fakeId,
        message,
        DatePlus.minsToSecs(timeCtrl),
        protectedTime ? DatePlus.minsToSecs(protectedTime) : undefined,
    )

    timer.start()

    timers[fakeId] = timer
}

/**
 * Discord Debate Timer
 *
 * @license BSD-3-Clause
 * @version 1.9.2
 * @author Luke Zhang luke-zhang-04.github.io/
 * @copyright 2020 - 2021 Luke Zhang
 */

import DatePlus from "@luke-zhang-04/dateplus/dist/cjs/dateplus.cjs"

const collectionInterval = DatePlus.minsToMs(30)

const collect = async (): Promise<void> => {
    const {polls} = await import("./commands/poll")
    const now = Date.now()

    for (const [key, poll] of Object.entries(polls)) {
        if (now - poll.createdAt > DatePlus.hrsToMs(1)) {
            Reflect.deleteProperty(polls, key)
        }
    }
}

let intervalId: NodeJS.Timeout | undefined

export const register = (): void => {
    collect()

    if (intervalId === undefined) {
        intervalId = setInterval(() => {
            collect()
        }, collectionInterval)
    }
}

export const unregister = (): void => {
    if (intervalId !== undefined) {
        clearInterval(intervalId)
    }

    intervalId = undefined
}

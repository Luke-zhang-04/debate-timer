/**
 * Discord Debate Timer
 * @copyright 2020 - 2021 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.7.0
 * @license BSD-3-Clause
 */

import {
    Message,
    User
} from "discord.js"
import {formatTime} from "./utils"
import {timers} from "."

export const getTimers = (user?: User): string => {
    // Get all the timers
    const matchingTimers = Object.values(timers)
        .filter((timer, index) => (
            index <= 10 && (
                user === undefined ||
                    user.id === timer.creator.id ||
                    user.id === timer.mentionedUid
            )
        ))

    // Format each timer to a string
    const timersString = matchingTimers.map((timer, index) => (
        `**${index + 1}**. Id: \`${timer.fakeId}\`, Created by: \`${timer.creator.username}\`, State: \`${timer.isPaused ? "paused" : "running"}\`, Time: \`${formatTime(timer.time)}\``
    ))

    // Message title/header
    const title = `${user?.id && `<@${user.id}>` || "global"}`

    return `**Timers for: ${title}**:\n${timersString.join("\n") || "None"}`
}

/**
 * Lists timers
 * @param message - Discord message
 * @returns void - sends message in function
 */
export const cmd = (message: Message): void => {
    const param = message.content.split(" ")[1]

    message.channel.send(getTimers(param === "global" ? undefined : message.author))
}

export default cmd

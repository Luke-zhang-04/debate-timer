/**
 * Discord Debate Timer
 *
 * @license BSD-3-Clause
 * @version 1.8.0
 * @author Luke Zhang luke-zhang-04.github.io/
 * @copyright 2020 - 2021 Luke Zhang
 */

import {Message, User} from "discord.js"
import {filter} from "../../utils"
import {formatTime} from "./utils"
import {timers} from "."

export const getTimers = (user?: User): string => {
    const matchingTimers = Array.from(
        filter(
            Object.values(timers),
            (timer: import(".").Timer) =>
                user === undefined ||
                user.id === timer.creator.id ||
                user.id === timer.mentionedUid,
            10,
        ),
    )

    // Format each timer to a string
    const timersString = matchingTimers.map(
        (timer, index) =>
            `**${index + 1}**. Id: \`${timer.fakeId}\`, Created by: \`${
                timer.creator.username
            }\`, State: \`${timer.isPaused ? "paused" : "running"}\`, Time: \`${formatTime(
                timer.time,
            )}\``,
    )

    // Message title/header
    const title = `${(user?.id && `<@${user.id}>`) || "global"}`

    return `**Timers for: ${title}**:\n${timersString.join("\n") || "None"}`
}

/**
 * Lists timers
 *
 * @param message - Discord message
 * @returns Void - sends message in function
 */
export const cmd = (message: Message): void => {
    const param = message.content.split(" ")[1]

    message.channel.send(getTimers(param === "global" ? undefined : message.author))
}

export default cmd

/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.3.1
 * @license BSD-3-Clause
 */

import {
    Message,
    User
} from "discord.js"
import {formatTime} from "./timer/utils"

/**
 * Lists timers and prints them to message.channel
 * @param param0 - message object to send to
 * @param user - user for looking for timers
 */
const listTimers = async ({channel}: Message, user?: User): Promise<void> => {
    const timers = Object.values((await import("./timer")).timers) // Get all the timers
        .filter((timer, index) => (index <= 10 && (
            user === undefined ||
            user.id === timer.creator.id ||
            user.id === timer.mentionedUid
        )))
    const timersString = timers.map((timer, index) => ( // Format each timer to a string
        `**${index + 1}**. Id: \`${timer.fakeId}\`, Created by: \`${timer.creator.username}\`, State: \`${timer.ispaused ? "paused" : "running"}\`, Time: \`${formatTime(timer.time)}\``
    ))
    const title = `${user?.id && `<@${user.id}>` || "global"}`

    channel.send(`**Timers for: ${title}**:\n${timersString.join("\n") || "None"}`)
}

export default (message: Message): Promise<void> => {
    const param = message.content.split(" ")[1]

    return listTimers(message, param === "global" ? undefined : message.author)
}

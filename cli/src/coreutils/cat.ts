/**
 * Discord Debate Timer
 * @copyright 2020 - 2021 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.7.0
 * @license BSD-3-Clause
 * @file lets you send messages on the bots behalf
 */

import type Discord from "discord.js"
import colors from "../colors"

/**
 * Like the Unix CAT command, but not really. Cat shows the last 15 messages from
 * a text channel
 * @param channel - channel to look at
 */
export const cat = async (
    channel: Discord.TextChannel,
): Promise<string> => {
    const replaceFunc = ({content, mentions}: Discord.Message): string => {
        let message = content

        for (const [_, user] of mentions.users) {
            message = message.replace(new RegExp(`<@(!)?${user.id}>`, "gui"), `${colors.blue}@${user.username}${colors.reset}`)
        }

        return message
    }

    const messages = await channel.messages.fetch({limit: 15})

    return messages.map((message) => (
        `${colors.biWhite}${message.author.username}${colors.reset}: ${replaceFunc(message)}`
    ))
        .reverse()
        .join("\n")
}

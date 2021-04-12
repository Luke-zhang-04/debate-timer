/**
 * Discord Debate Timer
 *
 * @license BSD-3-Clause
 * @version 1.8.0
 * @author Luke Zhang luke-zhang-04.github.io/
 * @copyright 2020 - 2021 Luke Zhang
 */

import {Message, TextChannel} from "discord.js"
import {hasAdminPerms, inlineTry} from "../utils"
import {adminRoleName} from "../getConfig"

// Code will get messier if I try to split it
/* eslint-disable max-statements */
/**
 * Broadcasts referenced message to all channels with regex
 *
 * @param message - Message object
 * @returns {Promise<void>}
 */
export const broadcast = async (message: Message): Promise<void> => {
    if (message.reference === null || message.reference.messageID === null) {
        await message.channel.send(
            "No message given. Make sure you reply to the message you want to broadcast.",
        )

        return
    } else if (message.guild === null) {
        await message.channel.send("Can't broadcast without a server")

        return
    } else if (!hasAdminPerms(message.member, adminRoleName)) {
        const {author} = message
        const randVal = Math.random()
        let msg = `Sorry <@${author.id}>, but you're not authorized to use this command.`

        if (randVal > 0.9) {
            msg = `Sorry <@${author.id}>, but we have a strict no leftist policy here.`
        } else if (randVal > 0.7) {
            msg = `Sorry (not really) <@${author.id}>, but you're not authorized to use this command.`
        }

        await message.channel.send(
            `${msg} Only those with the \`${adminRoleName.value}\` ${
                adminRoleName.type === "name" ? "role" : "permission"
            } may use this command.`,
        )

        return
    }

    const args = message.content.split(" ")
    const givenRegex = args.slice(1).find((val) => isNaN(Number(val)))

    if (!givenRegex) {
        await message.channel.send("Can't broadcast message. No regex restraint provided.")

        return
    }

    const maxBroadcasts = Number(args.find((val) => !isNaN(Number(val))) ?? Infinity)
    const regex = inlineTry(() => new RegExp(givenRegex, "u"))

    if (regex instanceof Error) {
        await message.channel.send(
            `Cannot broadcast message. Reason:\n\`\`\`${regex.name}\n${regex.message}\`\`\`\n${
                Math.random() > 0.5 ? "Smooth brain" : "Brainlet"
            }, learn to regex. <https://developer.mozilla.org/docs/Web/JavaScript/Guide/Regular_Expressions/Cheatsheet>, or run \`!help regex\``,
        )

        return
    }

    const {content: broadcastContent} = await message.channel.messages.fetch(
        message.reference.messageID,
    )
    const sent: Promise<Message>[] = []
    let broadcasts = 0

    for (const [_, channel] of message.guild.channels.cache) {
        if (
            channel instanceof TextChannel &&
            regex.test(channel.name) &&
            message.guild.me?.permissionsIn(channel).has(["SEND_MESSAGES", "VIEW_CHANNEL"])
        ) {
            if (broadcasts >= maxBroadcasts) {
                break
            }

            sent.push(channel.send(broadcastContent))
            broadcasts++
        }
    }

    try {
        await Promise.all(sent)

        await message.channel.send(
            `Success! Your message was broadcast to ${sent.length} channels!`,
        )
    } catch (err: unknown) {
        const error =
            err instanceof Error ? err : new Error(typeof err === "string" ? err : String(err))

        await message.channel.send(
            `An error occured. Reason:\n\`\`\`${error.name}\n${error.message}\`\`\``,
        )
    }
}
/* eslint-enable max-statements */

export default broadcast

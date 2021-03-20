/**
 * Discord Debate Timer
 * @copyright 2020 - 2021 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.7.0
 * @license BSD-3-Clause
 */

import type {
    Message,
    User
} from "discord.js"
import {emojis} from "../getConfig"

type PollData = [id: string, username: string][]

const pollOptions: {[key: string]: PollData} = {}

for (const emoji of Object.keys(emojis)) {
    pollOptions[emoji] = []
}

const getEmojiUsage = (
    emoji: string,
    id: string | null = null,
): string | undefined => {
    for (const [role, info] of Object.entries(emojis)) {
        if (emoji === info.name && (!id && !info.id || id === info.id)) {
            return role
        }
    }

    return undefined
}

class Poll {

    public readonly createdAt = Date.now()

    public readonly user: User

    public constructor (
        userMessage: Message,
        public readonly message: Message,
    ) {
        this.user = userMessage.author
    }

    public get data (): {[key: string]: PollData} {
        const data: typeof pollOptions = {}

        for (const [_, {emoji, users}] of this.message.reactions.cache) {
            const usage = getEmojiUsage(emoji.name, emoji.id)

            if (usage) {
                (data[usage] ??= []).push(...users.cache.map((user) => [
                    user.id,
                    user.username.replace(/ /gu, "-"),
                ]) as PollData)
            }
        }

        return data
    }

    public getDataByKey (key: string): PollData | undefined {
        for (const [_, {emoji, users}] of this.message.reactions.cache) {
            const usage = getEmojiUsage(emoji.name, emoji.id)

            if (usage && usage === key) {
                return users.cache.map((user) => [
                    user.id,
                    user.username.replace(/ /gu, "-"),
                ])
            }
        }

        return pollOptions[key] === undefined ? undefined : []
    }

}

/**
 * Object with polls for each user
 * Each key is the user id, and the values are the poll class
 */
export const polls: {[key: string]: Poll} = {}

/**
 * Makes a poll
 * @param message - Discord message
 * @param client - Discord client
 * @returns void - sends the message in the function
 */
export const makePoll = async (
    message: Message,
): Promise<void> => {
    const newMessage = await message.channel.send(`**Poll**
React here for what you feel like doing today. Here are your options:

${Object.entries(emojis).map(([role, emoji]) => {
        const formattedEmoji = emoji.id
            ? `<:${emoji.name}:${emoji.id}>`
            : emoji.name

        return `${role}: ${formattedEmoji}`
    })
        .join("\n")}`,
    )

    polls[message.author.id] = new Poll(message, newMessage)
}

/**
 * Gets a poll's details
 * @param channel - Discord channel
 * @returns void - sends the message in the function
 */
export const getPoll = (message: Message): void => {
    const userPoll = polls[message.author.id]

    if (userPoll === undefined) {
        message.channel.send(`Sorry <@${message.author.id}>, but I couldn't find your poll. Maybe your poll expired?`)

        return
    }

    const args = message.content.split(" ").slice(1)
    const key = args.find((arg) => arg !== "raw")
    const isRaw = args.find((arg) => arg === "raw") !== undefined

    if (key) {
        const reactions = userPoll.getDataByKey(key)

        if (reactions === undefined) {
            message.channel.send(
                `No such poll option \`${key}\`. Your options are: \`${Object.keys(pollOptions).join(", ")}.\``,
            )
        } else if (reactions.length === 0) {
            message.channel.send("*empty*")
        } else {
            message.channel.send(
                reactions.map(([userId, username]) => (
                    isRaw ? username : `<@${userId}>`
                )).join(" "),
            )
        }
    } else {
        message.channel.send(`<@${message.author.id}>'s Poll

${Object.entries(userPoll.data).map(([usage, users]) => (
        `- **${usage}**: ${users.map(([userId, username]) => (
            isRaw ? username : `<@${userId}>`
        )).join(" ")}`
    ))
        .join("\n")}`)
    }
}

export default {
    makePoll,
    getPoll,
}

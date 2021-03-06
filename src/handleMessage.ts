/**
 * Discord Debate Timer
 *
 * @license BSD-3-Clause
 * @version 1.9.3
 * @author Luke Zhang luke-zhang-04.github.io/
 * @copyright 2020 - 2021 Luke Zhang
 */

import config, {prefix} from "./getConfig"
import Filter from "bad-words"
import commands from "./getCommands"
import didyoumean from "didyoumean"
import {getFirst} from "./utils"

// Swear words filter
const filter = new Filter()

filter.addWords(...config.blacklistedWords)
filter.removeWords(...config.whitelistedWords)

didyoumean.threshold = 0.6

let lastCommand = 0

/**
 * Handle a command (starts with !)
 *
 * @param message - Message object
 * @param client - Client object
 * @returns Unknown
 */
const handleCmd = async (message: Message, client: Client): Promise<void> => {
    // Trip duplicate spaces to just one space
    message.content = message.content.replace(/  +/giu, " ").trim()

    // Command name
    const [cmd] = message.content.slice(prefix.length).split(" ")

    if (config.shouldRespondToUnknownCommand && (cmd ?? "") === "") {
        await message.channel.send(
            `:wave: Hey there! Yes, I'm alive. If you need help using me, type \`${prefix}help\`!`,
        )

        return
    }

    const correctedCmd = config.shouldUseFuzzyStringMatch
        ? getFirst(didyoumean(cmd, Object.keys(commands)))
        : cmd

    if (correctedCmd !== null) {
        const command = commands[correctedCmd]

        if (commands !== undefined) {
            if (correctedCmd.toLowerCase() !== cmd.toLowerCase()) {
                const shouldTypo = process.env.NODE_ENV !== "test" && Math.random() > 0.75
                const content = `Automatically corrected your input from \`${cmd}\` to \`${correctedCmd}\`. Learn to ${
                    shouldTypo ? "tpye" : "type"
                }.`

                message.channel.send(content).then((_message) => {
                    if (shouldTypo) {
                        setTimeout(() => {
                            _message.edit(`${content.replace(/tpe|tpye/gu, "type")}`)
                        }, 2500)
                    }
                })
            }

            await command(message, client)

            return
        }
    }

    if (config.shouldRespondToUnknownCommand) {
        const shouldTypo = process.env.NODE_ENV !== "test" && Math.random() > 0.75
        const content = `:confused: The command \`${message.content.slice(
            prefix.length,
        )}\` is not recognized.\nIf this was a typo, learn to ${
            shouldTypo ? "tpe" : "type"
        }.\nOtherwise, ${shouldTypo ? "tpye" : "type"} \`${prefix}help\` for help.`

        message.channel.send(content).then((_message) => {
            if (shouldTypo) {
                setTimeout(() => {
                    _message.edit(`${content.replace(/tpe|tpye/gu, "type")}`)
                }, 2500)
            }
        })
    }
}

/* eslint-disable */
/**
 * Messages go through this
 *
 * @param message - Message object
 * @returns Void
 */
export const handleMessage = async (message: Message, client: Client): Promise<void> => {
    if (!message.author.bot) {
        if (message.content.trim().startsWith(config.prefix)) {
            const timeGap = config.commandCooldown * 1000

            if (process.env.NODE_ENV === "test" || Date.now() - lastCommand >= timeGap) {
                // Time gap reached
                await handleCmd(message, client)
                lastCommand = Date.now()

                return
            }

            message.channel.send(
                `The configured command cooldown is ${config.commandCooldown}s. Since this bot is hosted on either some crappy server or Luke's laptop, there needs to be a cooldown. The cooldown time can be changed in the configuration file.`,
            )
        } else if (config.shouldDetectProfanity && filter.isProfane(message.content)) {
            // Swear word detected
            const number = Math.random(),
                author = message.author.id

            if (number <= 0.6) {
                message.channel.send(`Hey <@${author}>! That's not very nice!`)
            } else if (number <= 0.7) {
                message.channel.send(
                    `Does your asshole get jealous of all the shit that comes out of your mouth <@${author}>?`,
                )
            } else if (number <= 0.8) {
                message.channel.send(`Don't fucking swear <@${author}> :angry:.`)
            } else {
                message.channel.send(`<@${author}>`, {
                    files: [
                        "https://stayhipp.com/wp-content/uploads/2019/02/you-better-watch.jpg",
                    ],
                })
            }
        } else if (new RegExp(`^<@(\\!)?${client.user?.id}>$`).test(message.content.trim())) {
            await message.channel.send(
                `:wave: Hey there! Yes, I'm alive. If you need help using me, type \`${prefix}help\`!`,
            )
        }
    }
}
/* eslint-enable */

export default handleMessage

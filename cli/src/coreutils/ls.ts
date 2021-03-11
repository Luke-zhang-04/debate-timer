/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.6.0
 * @license BSD-3-Clause
 * @file lets you send messages on the bots behalf
 */

import Discord from "discord.js"
import colors from "../colors"

type Channel = Discord.Guild |
    Discord.TextChannel |
    Discord.CategoryChannel

/**
 * List all servers, categories, or channels within the current context of the bot
 * @param client - client to send to
 * @param head - the current server/category/channel
 */
export const ls = (
    client: Discord.Client,
    head?: Channel,
    guild?: Discord.Guild,
): string => {
    let items = `${colors.biBlue}.${colors.reset}/  ${colors.biBlue}..${colors.reset}/  ` // ./ and ../

    if (head === undefined) {
        // Get all servers
        const guilds = client.guilds.cache
            .map((guild) => guild.name)
            .sort()
            .map((name) => `${colors.biBlue}${name}${colors.reset}/  `)
            .join("")

        // Format the servers like in Unix ls
        items += guilds
    } else if (head instanceof Discord.TextChannel) {
        return items
    } else if (head instanceof Discord.Guild) {
        // Get all categories and text channels
        const channels = head.channels.cache
            .filter((channel) => (
                ["text", "category"].includes(channel.type)
                    ? channel.parent === null
                    : false
            ),
            )
            .sort()
            .map((channel) => (
                channel.type === "category"
                    ? `${colors.biGreen}${channel.name}${colors.reset}/  `
                    : `${colors.reset}${channel.name}  `
            ))
            .join("")

        items += channels
    } else {
        // Get all text channels in this category
        const channels = guild?.channels.cache
            .filter((channel) => (
                channel.type === "text" && channel.parent?.id === head.id
            ))
            .sort()
            .map((channel) => `${channel.name}/  `)
            .join("")

        items += channels
    }

    return items
}

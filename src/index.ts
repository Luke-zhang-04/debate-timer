/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.1.0
 * @license BSD-3-Clause
 */

import Discord from "discord.js"
import dotenv from "dotenv"
import handleMessage from "./handleMessage"
import {prefix} from "./getConfig"

dotenv.config()

console.log("Copyright 2020 Luke Zhang. This program comes with ABSOLUTELY NO WARRANTY. This is free software, and you are welcome to redistribute it under certain conditions; see https://github.com/Luke-zhang-04/debate-timer/blob/master/LICENSE for more details.")

export const client = new Discord.Client()

client.login(process.env.AUTHTOKEN)

client.once("ready", () => {
    const channel = client.channels.cache.find((_channel) => (
        (_channel as Discord.TextChannel).name === "spam"
    )) as Discord.TextChannel

    channel.send("Timer bot is online!")
    console.log("Timer bot is online!")

    client.user?.setPresence({
        status: "online",
        activity: {
            name: `for a ${prefix}command`,
            type: "WATCHING",
        },
    })
})

client.on("message", (message) => {
    try {
        if (message.content.includes(`${prefix}ping`)) {
            message.channel.send(`:ping_pong: Latency is ${Math.round(client.ws.ping)}ms`)

            return
        }

        handleMessage(message)
    } catch (err) {
        console.error(err)
        message.channel.send(`:dizzy_face: Sorry, this bot has died (crashed) due to an unexpected error ${err}.\n\nIn all likelyhood, the bot itself is fine. You should still be able to run commands.`)
    }
})

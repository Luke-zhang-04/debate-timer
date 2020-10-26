/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @license MIT
 */

import Discord from "discord.js"
import dotenv from "dotenv"
import handleMessage from "./handleMessage"
import {prefix} from "./getConfig"

dotenv.config()

export const client = new Discord.Client()

client.login(process.env.AUTHTOKEN)

client.once("ready", () => {
    console.log("Timer bot is online!")

    const channel = client.channels.cache.find((_channel) => (
        (_channel as Discord.TextChannel).name === "spam"
    )) as Discord.TextChannel

    channel.send("Timer bot is online!")

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

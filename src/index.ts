/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @license MIT
 */

import Discord from "discord.js"
import dotenv from "dotenv"
import handleMessage from "./handleMessage"

dotenv.config()

const client = new Discord.Client()

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
            name: "for a !command",
            type: "WATCHING",
        },
    })
})

client.on("message", (msg) => handleMessage(msg))

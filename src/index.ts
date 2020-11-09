/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.3.0
 * @license BSD-3-Clause
 */
import {hostname, userInfo} from "os"
import DatePlus from "@luke-zhang-04/dateplus"
import Discord from "discord.js"
import dotenv from "dotenv"
import fs from "fs/promises"
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

client.on("message", async (message) => {
    try {
        // Any commands that need the client object should go here (some exceptions)
        if (message.content === `${prefix}ping`) {
            message.channel.send(`:ping_pong: Latency is ${Math.round(client.ws.ping)}ms`)

            return
        }

        handleMessage(message, client)
    } catch (err) {
        const date = new Date()
        const formattedDate = DatePlus.addZeros(
            `${date.getDay() + 1}/${date.getMonth() + 1}/${date.getFullYear()}`
        )
        const formattedTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        const prevContents = await (async () => {
            try {
                return (await fs.readFile("bot.error.log")).toString()
            } catch {
                return ""
            }
        })()

        console.error(err)
        message.channel.send(`:dizzy_face: Sorry, this bot has died (crashed) due to an unexpected error \`${err}\`.\n\nIn all likelyhood, the bot itself is fine. You should still be able to run commands.\nI've logged the error in an error log file.`)

        await fs.writeFile(
            "bot.error.log",
            `${hostname()} ${userInfo().username} [${formattedDate}:${formattedTime} ${Date.now()}] ERROR - "${err}"\n${prevContents}`,
        )
    }
})

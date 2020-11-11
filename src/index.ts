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
import fs from "fs"
import handleMessage from "./handleMessage"
import {prefix} from "./getConfig"

const readFile = (path: string): Promise<string> => (
    new Promise((resolve, reject) => {
        fs.readFile(path, "utf-8", (err, data) => {
            if (err) {
                return reject(err)
            }

            return resolve(data)
        })
    })
)

const writeFile = (path: string, content: string): Promise<void> => (
    new Promise((resolve, reject) => {
        fs.writeFile(path, content, "utf-8", (err) => {
            if (err) {
                return reject(err)
            }

            return resolve()
        })
    })
)

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
    } catch (err: unknown) {
        const date = new Date()
        const formattedDate = DatePlus.addZeros(
            `${date.getDay() + 1}/${date.getMonth() + 1}/${date.getFullYear()}`,
        )
        const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
        const formattedTime = `${date.getHours()}:${date.getMinutes()}:${seconds}`
        const prevContents = await (async (): Promise<string> => {
            try {
                return await readFile("bot.error.log")
            } catch {
                return ""
            }
        })()
        let stack: undefined | string = ""

        console.error(err)
        message.channel.send(`:dizzy_face: Sorry, this bot has died (crashed) due to an unexpected error \`${err}\`.\n\nIn all likelyhood, the bot itself is fine. You should still be able to run commands.\nI've logged the error in an error log file.`)

        if (err instanceof Error) {
            // eslint-disable-next-line
            stack = err.stack
        }

        await writeFile(
            "bot.error.log",
            `${hostname()} ${userInfo().username} [${formattedDate}:${formattedTime} ${Date.now()}] ERROR - "${err}" Stack trace; most recent call first:\n${stack}\n${prevContents}`,
        )
    }
})

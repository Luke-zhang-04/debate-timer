/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.2.0
 * @license BSD-3-Clause
 * @file lets you send messages on the bots behalf
 */

import Discord from "discord.js"
import dotenv from "dotenv"
import fs from "fs/promises"
import prompts from "prompts"

dotenv.config()

console.log("Copyright 2020 Luke Zhang. This program comes with ABSOLUTELY NO WARRANTY. This is free software, and you are welcome to redistribute it under certain conditions; see https://github.com/Luke-zhang-04/debate-timer/blob/master/LICENSE for more details.")

export const client = new Discord.Client()

client.login(process.env.AUTHTOKEN)

const connected = new Promise((resolve) => {
    client.once("ready", resolve)
});

/* eslint-disable no-await-in-loop, no-constant-condition, max-statements, require-atomic-updates */

(async (): Promise<void> => {
    await connected
    console.log("Connected to client")

    const {version} = JSON.parse(
        (await fs.readFile("package.json")).toString(),
    )

    let channel = client.channels.cache.find((_channel) => (
        (_channel as Discord.TextChannel).name === "spam"
    )) as Discord.TextChannel,
        shouldcontinueRunning = true

    console.log(`\nCLI Version ${version}\n`)

    while (shouldcontinueRunning) {
        const response = await prompts({
            type: "text",
            name: "text",
            message: `debate-timer-bot ${Math.round(client.ws.ping)}ms #${channel.name} ->`,
        })

        const command = (response.text as string)

        if (command === "exit") {
            console.log("Exiting . . . goodbye!")
            shouldcontinueRunning = false
        } else if (command === "help") {
            console.log("Help for CLI:\n\"send [msg]\" sends a message to a channel.\n\"cc [channelname]\" changes your text channel\n\"exit\" exits the CLI")
        } else if (command.split(" ")[0] === "cc") {
            console.log(`Changing channels to "${command.split(" ")[1]}"`)
            const targetChannel = client.channels.cache.find((_channel) => (
                (_channel as Discord.TextChannel).name === command.split(" ")[1]
            )) as Discord.TextChannel | undefined

            if (targetChannel === undefined) {
                console.log(`Channel not found: ${command.split(" ")[1]}`)
            } else {
                channel = targetChannel

                console.log("Changed channel")
            }
        } else if (command.split(" ")[0] === "send") {
            console.log(`Sending "${command.slice(5)}" . . .`)
            await channel.send(command.slice(5))
            console.log("Sent")
        } else if (command !== "") {
            console.log(`Unknown command "${command.split(" ")[0]}"`)
        }
    }

    client.destroy()
})()

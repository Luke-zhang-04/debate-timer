/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @license MIT
 * @file lets you send messages on the bots behalf
 */

import Discord from "discord.js"
import dotenv from "dotenv"
import prompts from "prompts"

dotenv.config()

export const client = new Discord.Client()

client.login(process.env.AUTHTOKEN)

const connected = new Promise((resolve) => {
    client.once("ready", resolve)
});

/* eslint-disable no-await-in-loop, no-constant-condition */

(async (): Promise<void> => {
    await connected
    console.log("Connected to client")

    let channel = client.channels.cache.find((_channel) => (
        (_channel as Discord.TextChannel).name === "spam"
    )) as Discord.TextChannel

    while (true) {
        const response = await prompts({
            type: "text",
            name: "text",
            message: `debate-timer-bot ${Math.round(client.ws.ping)} #${channel.name} ->`,
        })

        if ((response.text as string)[0] === "$") {
            const command = (response.text as string).slice(1)

            if (command === "exit") {
                console.log("Exiting . . . goodbye!")
                break
            } else if (command === "help") {
                console.log("Help for CLI:\nUse $ for a command\nType anything to send it to a channel\n$channel [channelname] changes your text channel\n$exit exits the CLI")
            } else if (command.split(" ")[0] === "channel") {
                console.log(`Changing channels to ${command.split(" ")[1]}`)
                channel = client.channels.cache.find((_channel) => (
                    (_channel as Discord.TextChannel).name === command.split(" ")[1]
                )) as Discord.TextChannel
                console.log("Changed channel")
            } else {
                console.log(`Unknown command ${command.split(" ")[0]}`)
            }
        } else if (response.text) {
            console.log(`Sending "${response.text}" . . .`)
            await channel.send(response.text)
            console.log("Sent")
        }
    }

    client.destroy()
})()

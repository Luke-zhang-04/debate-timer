/**
 * Discord Debate Timer
 *
 * @license BSD-3-Clause
 * @version 1.10.0
 * @author Luke Zhang luke-zhang-04.github.io/
 * @file lets You send messages on the bots behalf
 * @copyright 2020 - 2021 Luke Zhang
 */

import * as coreutils from "./coreutils"
import Discord from "discord.js"
import colors from "./colors"
import dotenv from "dotenv"
import fs from "fs"
import Ora from "ora"
import prompts from "prompts"

dotenv.config()

console.log(
    "Copyright 2020 Luke Zhang. This program comes with ABSOLUTELY NO WARRANTY. This is free software, and you are welcome to redistribute it under certain conditions; see https://github.com/Luke-zhang-04/debate-timer/blob/master/LICENSE for more details.",
)

export const client = new Discord.Client()

client.login(process.env.AUTHTOKEN)

export type Channels = [
    server?: Discord.Guild,
    ...channels: (Discord.TextChannel | Discord.CategoryChannel)[]
]

const connected = new Promise<void>((resolve) => {
    client.once("ready", resolve)
})

const readFile = (path: string): Promise<string> =>
    new Promise((resolve, reject) => {
        fs.readFile(path, "utf-8", (err, data) => {
            if (err) {
                return reject(err)
            }

            return resolve(data)
        })
    })

/* eslint-disable no-await-in-loop, no-constant-condition, max-statements, require-atomic-updates */

// Main CLI IIFE
;(async (): Promise<void> => {
    await connected
    console.log("Connected to client")

    // Get CLI Version
    const {version} = JSON.parse(await readFile("package.json")) as {version: string}

    // Current channel(s) that the user is on
    const channels: Channels = []

    // Fix some weird things when breaking a loop
    let shouldcontinueRunning = true

    // Current working directory
    let cwd = "/"

    console.log(`\nCLI Version ${version}\n`)

    while (shouldcontinueRunning) {
        const fullCommand = await prompts({
            // Get input
            type: "text",
            name: "text",
            message: `debate-timer-bot ${Math.round(client.ws.ping)}ms ${cwd} ->`,
        })
            .then(({text}) => text as string)
            .catch(() => "")

        if (fullCommand === undefined) {
            // Deal with undefined input
            continue
        }

        const command = fullCommand.split(" ")[0] // Name of the command ONLY
        const currentChannel = channels[channels.length - 1]

        switch (command) {
            case "exit":
                console.log("Exiting . . . goodbye!")
                shouldcontinueRunning = false

                break

            case "help":
                console.log(
                    'Help for CLI:\n"(send | echo) [msg]" sends a message to a channel.\n"cd [server, category, or channel name]" changes your current localtion\n"ls" lists the current channel\'s contents\n"(cat | show)" shows the contents of the current text channel\n"exit" exits the CLI',
                )

                break

            case "cat":
            case "show":
                await (async () => {
                    const currentGuild = channels[0]

                    // If the bot isn't currently in a text channel, fail
                    if (!(currentChannel instanceof Discord.TextChannel)) {
                        console.log("Cannot read from a non-text channel.")

                        return
                    } else if (currentGuild === undefined) {
                        console.log("No guild found")

                        return
                    }

                    // Initialize spinner
                    const spinner = Ora({
                        discardStdin: true,
                        spinner: "line",
                        text: `Showing messages from ${cwd} . . .`,
                        color: "blue",
                    }).start()

                    try {
                        const content = await coreutils.cat(currentChannel)

                        spinner.succeed()

                        console.log(content)
                    } catch (err: unknown) {
                        err instanceof Error
                            ? spinner.fail(
                                  `${colors.biRed}${err.name}${colors.red}: ${err.message}${colors.reset}`,
                              )
                            : (() => {
                                  spinner.fail(String(err))
                                  console.log(err)
                              })()
                    }
                })()

                break

            case "cd": // Change "directory"
            case "cc":
                // Name of new directory target
                const newDir = fullCommand.split(" ").slice(1).join(" ")

                if (newDir === undefined) {
                    break
                }

                coreutils.cd(client, channels, newDir)
                cwd = channels
                    .map(
                        (channel) =>
                            `/${channel instanceof Discord.TextChannel ? "#" : ""}${
                                channel?.name ?? "?"
                            }`,
                    )
                    .join("")
                    .trim()

                break

            case "echo": // Send a message to channel
            case "send":
                await (async () => {
                    // If the bot isn't currently in a text channel, fail
                    if (!(currentChannel instanceof Discord.TextChannel)) {
                        console.log("Cannot send to a non-text channel.")

                        return
                    }

                    // Initialize spinner
                    const spinner = Ora({
                        discardStdin: false,
                        spinner: "line",
                        text: `Sending "${fullCommand.slice(5)}" to ${cwd} . . .`,
                        color: "blue",
                    }).start()

                    try {
                        await currentChannel.send(fullCommand.slice(5))
                        spinner.succeed("Sent")
                    } catch (err: unknown) {
                        err instanceof Error
                            ? spinner.fail(
                                  `${colors.biRed}${err.name}${colors.red}: ${err.message}${colors.reset}`,
                              )
                            : (() => {
                                  spinner.fail(String(err))
                                  console.log(err)
                              })()
                    }
                })()

                break

            case "ls": // List "directory"
                console.log(coreutils.ls(client, channels[channels.length - 1], channels[0]))

                break

            case "":
                break

            default:
                console.log(`Unknown command "${command}`)

                break
        }
    }

    client.destroy()
})()

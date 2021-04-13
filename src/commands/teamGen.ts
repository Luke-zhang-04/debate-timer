/**
 * Discord Debate Timer
 *
 * @license BSD-3-Clause
 * @version 1.9.2
 * @author Luke Zhang luke-zhang-04.github.io/
 * @copyright 2020 - 2021 Luke Zhang
 */

import {arrayToChunks, inlineTryPromise, shuffle} from "../utils"
import {getRandomMotion} from "./randomMotion"

export type Formats = "bp" | "cp" | "worlds"

/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
const baseTeams: Record<Formats, string[]> = {
    bp: ["Team-A", "Team-B", "Team-C", "Team-D"],
    cp: ["Team-A", "Team-B"],
    worlds: ["Team-A", "Team-B"],
}
const basePositions: Record<Formats, string[]> = {
    bp: ["OG", "OO", "CG", "CO"],
    cp: ["GOV", "OPP"],
    worlds: ["GOV", "OPP"],
}
/* eslint-enable @typescript-eslint/consistent-indexed-object-style */

/**
 * Create random partners
 *
 * @param message - Message object
 * @returns Debaters, format
 */
const createRandomPartners = (
    message: Message,
    messageRef?: Message | null,
): [string[][], Formats] | void => {
    // Invocation message
    const invocation = `${message.content} ${messageRef?.content.replace(/  +/gu, " ") ?? ""}`
        .trim()
        .split(" ")

    // Array of debaters
    const debaters = invocation
        .slice(1)
        .filter((content) => !["bp", "worlds", "cp"].includes(content.toLowerCase()))

    // Get the debate format
    const format: Formats = (
        invocation.find((content) => ["bp", "worlds", "cp"].includes(content.toLowerCase())) ??
        "bp"
    ).toLowerCase() as Formats

    // Members per team
    const membersPerTeam = format === "worlds" ? 3 : 2

    if (debaters.length < basePositions[format].length * membersPerTeam) {
        // Mention count
        message.channel.send(
            `:1234: at least ${
                basePositions[format].length * membersPerTeam
            } @mentions required, but ${debaters.length} ${
                debaters.length === 1 ? "was" : "were"
            } found. Learn to count. (That's smaller than ${
                basePositions[format].length * membersPerTeam
            }, right?)`,
        )

        return undefined
    }

    shuffle(debaters, 4)

    debaters.length = basePositions[format].length * membersPerTeam // Truncate the array to the proper length

    return [arrayToChunks(debaters, membersPerTeam), format]
}

/**
 * Sends random teams to channel
 *
 * @param message - Message object
 */
export const makeTeams = (message: Message): void => {
    // Get the debate format
    const format: Formats = (
        message.content
            .split(" ")
            .find((content) => ["bp", "worlds", "cp"].includes(content.toLowerCase())) ?? "bp"
    ).toLowerCase() as Formats

    // Teams based on format
    const teams = [...baseTeams[format]]

    shuffle(teams, 2)

    const teamString = teams
        .map((team, index) => `\n> **${basePositions[format][index]}**: ${team}`)
        .join("")

    message.channel.send(`:speaking_head: **Generated random teams**: ${teamString}`)
}

/**
 * Send random partners to channel
 *
 * @param message - Message object
 */
export const makePartners = (message: Message): void => {
    const {reference} = message
    const messageRef = reference
        ? message.channel.messages.cache.find((msg) => msg.id === reference.messageID)
        : undefined
    const randomPartners = createRandomPartners(message, messageRef)

    if (randomPartners) {
        const [debaters, format] = randomPartners

        // Add debaters to a string and then send it
        const partnersString = debaters
            .map(
                (_debaters, index) =>
                    `\n> **${baseTeams[format][index]}**: ${_debaters.join(", ")}`,
            )
            .join()

        message.channel.send(`:speaking_head: **Generated random partners**: ${partnersString}`)
    }
}

/**
 * Sends random partners and teams to channel
 *
 * @param message - Message object
 */
export const makeDraw = (message: Message): void => {
    const {reference} = message
    const messageRef = reference
        ? message.channel.messages.cache.find((msg) => msg.id === reference.messageID)
        : undefined
    const randomPartners = createRandomPartners(message, messageRef)

    if (randomPartners) {
        const [debaters, format] = randomPartners

        // Draw with teams
        const draw = debaters
            .map(
                (_debaters, index) =>
                    `\n> **${basePositions[format][index]}**: ${_debaters.join(", ")}`,
            )
            .join()

        message.channel.send(`:speaking_head: **Generated random draw**: ${draw}`)
    }
}

/**
 * Sends a draw + a motion
 *
 * @param message - Message object
 */
export const makeRound = async (message: Message): Promise<void> => {
    const {reference} = message
    const messageRef = reference
        ? message.channel.messages.cache.find((msg) => msg.id === reference.messageID)
        : undefined
    const randomPartners = createRandomPartners(message, messageRef)

    if (randomPartners) {
        const [debaters, format] = randomPartners

        // Draw with teams
        const draw = debaters
            .map(
                (_debaters, index) =>
                    `\n> **${basePositions[format][index]}**: ${_debaters.join(", ")}`,
            )
            .join()

        // Debate motion
        const motion = await getRandomMotion()

        message.channel.send(
            `:speaking_head: **Here's the round**: ${draw}\n\n**Motion:**\n${motion}`,
        )
    }
}

export const newMotion = async (message: Message): Promise<void> => {
    if (!(message.guild === null || message.member?.permissions.has("MANAGE_MESSAGES", true))) {
        await message.channel.send("You don't have permission to edit this motion")

        return
    }

    const seperator = "**Motion:**"
    const {reference} = message

    if (reference === null || reference.messageID === null) {
        await message.channel.send(
            "No message given. Make sure you reply to the message you want to redraw the motion to.",
        )

        return
    }

    const messageRef = await message.channel.messages.fetch(reference.messageID)
    const oldMessage = messageRef.content.split(seperator)

    if (!oldMessage[1]) {
        await message.channel.send("Error getting new motion; couldn't parse message properly.")

        return
    }

    const motion = await inlineTryPromise<string>(async () => await getRandomMotion())

    if (motion instanceof Error) {
        await message.channel.send(
            `Error getting a new motion:\n\n${motion.name}\n${motion.message}`,
        )

        return
    }

    oldMessage[1] = `\n${motion}`

    await messageRef.edit(oldMessage.join(seperator))

    if (message.guild?.me?.permissions.has("MANAGE_MESSAGES")) {
        message.delete()
    }
}

export default {
    makeDraw,
    makeTeams,
    makePartners,
    makeRound,
    newMotion,
}

/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.4.5
 * @license BSD-3-Clause
 */

import type {Message} from "discord.js"
import {getRandomMotion} from "./randomMotion"

export type Formats = "bp" | "cp" | "worlds"

const baseTeams: Record<Formats, string[]> = {
    bp: [
        "Team-A",
        "Team-B",
        "Team-C",
        "Team-D",
    ],
    cp: [
        "Team-A",
        "Team-B",
    ],
    worlds: [
        "Team-A",
        "Team-B",
    ],
},
    basePositions: Record<Formats, string[]> = {
        bp: [
            "OG",
            "OO",
            "CG",
            "CO",
        ],
        cp: [
            "GOV",
            "OPP",
        ],
        worlds: [
            "GOV",
            "OPP",
        ],
    },

    /**
     * Shuffles an array
     * @param array - array to shuffle
     * @param cycles - number of shuffle cycles to go through
     * @returns void; shuffles in-place
     */
    shuffle = <T>(array: T[], cycles = 1): void => {
        for (let _ = 0; _ < cycles; _++) {
            for (let index = array.length - 1; index > 0; index--) {
                const randonIndex = Math.floor(Math.random() * (index + 1)),
                    temp = array[index]

                array[index] = array[randonIndex]
                array[randonIndex] = temp
            }
        }
    },

    /**
     * Splits an array into chunks
     * @param arr - array to split
     * @param chunkSize - size of array chunks
     */
    arrayToChunks = <T>(arr: T[], chunkSize = 2): T[][] => {
        const chunks: T[][] = []

        for (let index = 0; index < arr.length; index += chunkSize) {
            chunks.push(arr.slice(index, index + chunkSize))
        }

        return chunks
    },

    /**
     * Create random partners
     * @param message - message object
     * @returns [debaters, format]
     */
    createRandomPartners = (message: Message): [string[][], Formats] | void => {
        // Invocation message
        const invocation = message.content.split(" "),

            // Array of debaters
            debaters = invocation.slice(1).filter((content) => (
                !["bp", "worlds", "cp"].includes(content.toLowerCase())
            )),

            // Get the debate format
            format: Formats = (invocation.find((content) => (
                ["bp", "worlds", "cp"].includes(content.toLowerCase())
            )) ?? "bp").toLowerCase() as Formats,

            // Members per team
            membersPerTeam = format === "worlds" ? 3 : 2

        if (debaters.length < basePositions[format].length * membersPerTeam) { // Mention count
            message.channel.send(`:1234: at least ${basePositions[format].length * membersPerTeam} @mentions required, but ${debaters.length} were found. Learn to count. (That's smaller than ${basePositions[format].length * membersPerTeam}, right?)`)

            return undefined
        }

        shuffle(debaters, 4)

        debaters.length = basePositions[format].length * membersPerTeam // Truncate the array to the proper length

        return [arrayToChunks(debaters, membersPerTeam), format]
    }

/**
 * Sends random teams to channel
 * @param message - message object
 */
export const makeTeams = (message: Message): void => {
    // Get the debate format
    const format: Formats = (message.content.split(" ").find((content) => (
        ["bp", "worlds", "cp"].includes(content.toLowerCase())
    )) ?? "bp").toLowerCase() as Formats,

        // Teams based on format
        teams = [...baseTeams[format]]

    shuffle(teams, 2)

    const teamString = teams.map((team, index) => (
        `\n> **${basePositions[format][index]}**: ${team}`
    )).join("")

    message.channel.send(`:speaking_head: **Generated random teams**: ${teamString}`)
}

/**
 * Send random partners to channel
 * @param message - message object
 */
export const makePartners = (message: Message): void => {
    const randomPartners = createRandomPartners(message)

    if (randomPartners) {
        const [debaters, format] = randomPartners,

            // Add debaters to a string and then send it
            partnersString = debaters.map((_debaters, index) => (
                `\n> **${baseTeams[format][index]}**: ${_debaters.join(", ")}`
            )).join()

        message.channel.send(`:speaking_head: **Generated random partners**: ${partnersString}`)
    }
}

/**
 * Sends random partners and teams to channel
 * @param message - message object
 */
export const makeDraw = (message: Message): void => {
    const randomPartners = createRandomPartners(message)

    if (randomPartners) {
        const [debaters, format] = randomPartners,

            // Draw with teams
            draw = debaters.map((_debaters, index) => (
                `\n> **${basePositions[format][index]}**: ${_debaters.join(", ")}`
            )).join()

        message.channel.send(`:speaking_head: **Generated random draw**: ${draw}`)
    }
}

/**
 * Sends a draw + a motion
 * @param message - message object
 */
export const makeRound = async (message: Message): Promise<void> => {
    const randomPartners = createRandomPartners(message)

    if (randomPartners) {
        const [debaters, format] = randomPartners,

            // Draw with teams
            draw = debaters.map((_debaters, index) => (
                `\n> **${basePositions[format][index]}**: ${_debaters.join(", ")}`
            )).join(),

            // Debate motion
            motion = await getRandomMotion()

        message.channel.send(`:speaking_head: **Here's the round**: ${draw}\n\n${motion}`)
    }
}

export default {
    makeDraw,
    makeTeams,
    makePartners,
    makeRound,
}

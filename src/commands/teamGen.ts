/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.0.0
 * @license MIT
 */

import type {
    DMChannel,
    Message,
    NewsChannel,
    TextChannel
} from "discord.js"

type Channel = TextChannel | DMChannel | NewsChannel

const baseTeams = [
    "Team-A",
    "Team-B",
    "Team-C",
    "Team-D",
]
const basePositions = [
    "OG",
    "OO",
    "CG",
    "CO",
]

/**
 * Shuffles an array
 * @param array - array to shuffle
 * @param cycles - number of shuffle cycles to go through
 * @returns void; shuffles in-place
 */
const shuffle = <T>(array: T[], cycles = 1) => {
    for (let _ = 0; _ < cycles; _++) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            const temp = array[i]

            array[i] = array[j]
            array[j] = temp
        }
    }
}

/**
 * Creates random teams
 * @param channel - channel object to send messages to
 * @returns void
 */
export const randomTeams = (channel: Channel): true => {
    const teams = [
        "Team-A",
        "Team-B",
        "Team-C",
        "Team-D",
    ]

    shuffle(teams, 2)

    let teamString = ""

    for (const [index, team] of teams.entries()) {
        teamString += `\n> **${basePositions[index]}**: ${team}`
    }

    channel.send(`:speaking_head: **Generated random teams**: ${teamString}`)

    return true
}

/**
 * Create random partners
 * @param message - message object
 * @returns boolean - id successful
 */
export const randomPartners = (message: Message): boolean => {
    const invocation = message.content.split(" ") // Invokation message

    if (invocation.length !== 9) { // Mention count
        message.channel.send(`:1234: 8 @mentions required, but ${invocation.length - 1} were found. Learn to count.`)

        return false
    }

    const debaters = invocation.splice(1) // Array of debaters

    shuffle(debaters, 4)

    let partnersString = ""

    // Add debaters to a string and then send it
    for (const [index, debater] of debaters.entries()) {
        if (index % 2 === 0) {
            partnersString += `\n> **${baseTeams[index / 2]}**: ${debater}, `
        } else {
            partnersString += `${debater}`
        }
    }

    message.channel.send(`:speaking_head: **Generated random partners**: ${partnersString}`)

    return true // Return true for success for makeRound
}

export default {
    randomTeams,
    randomPartners,
}

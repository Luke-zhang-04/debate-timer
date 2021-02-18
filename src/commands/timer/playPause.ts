/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.4.1
 * @license BSD-3-Clause
 */

import type {Message} from "discord.js"
import {adminRoleName} from "../../getConfig"
import {isauthorizedToModifyTimer} from "./utils"

/**
 * Pauses a timer with id
 * @param param0 - message object with message info
 * @param id - timer id - could be undefined, but shouldn't be
 * @returns void
 */
export const playPause = async (
    {author, member, channel}: Message,
    id?: string,
    playOrPause?: "resume" | "pause",
): Promise<void> => {
    const numericId = Number(id)

    if (id === undefined) { // Id was never provided. Terminate.
        channel.send(":confused: Argument [id] not provided. For help using this command, run the `!help` command.")

        return
    } else if (isNaN(numericId)) { // Id couldn't be parsed as a number. Terminate.
        channel.send(`:1234: Could not parse \`${id}\` as a number. Learn to count.`)

        return
    }

    channel.send(`Looking for timer with id ${id}`)

    // Array of timers from index
    const {timers} = await import("."),

        // The current timer
        timer = timers[numericId]

    if (timer === undefined) {
        channel.send(`:confused: Could not find timer with id ${id}`)
    } else if (isauthorizedToModifyTimer(member, author, timer)) {
        timer.playPause(playOrPause)

        channel.send(`${playOrPause === "pause" ? "Paused" : "Continuing"} timer with id ${id}`)
    } else {
        channel.send(`Sorry <@${author.id}>, but you're not authorized to modify this protected timer. Only <@${timer.creator.id}> of the timer and those with the ${adminRoleName} role may modify this timer.`)
    }
}

export default playPause

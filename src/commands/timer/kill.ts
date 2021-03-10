/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.5.0
 * @license BSD-3-Clause
 */


import type {Message} from "discord.js"
import {adminRoleName} from "../../getConfig"
import {isauthorizedToModifyTimer} from "./utils"

/**
 * Kills a timer with id
 * @param param0 - message object with message info
 * @param id - timermessage.member.roles id - could be undefined, but shouldn't be
 * @returns void
 */
export const kill = async (
    {author, member, channel}: Message,
    id?: string,
    shouldmute?: boolean,
): Promise<void> => {
    const numericId = Number(id)

    if (id === undefined) { // Id was never provided. Terminate.
        channel.send(":confused: Argument [id] not provided. For help using this command, run the `!help` command.")

        return
    } else if (isNaN(numericId)) { // Id couldn't be parsed as a number. Terminate.
        channel.send(`:1234: Could not parse \`${id}\` as a number. Learn to count.`)

        return
    }

    const num = Math.random()

    if (num < 0.5) {
        channel.send(`Looking for timer with id ${id}`)
    } else if (num < 0.75) {
        channel.send(`Sending hitman for timer with id ${id}`)
    } else {
        channel.send(`Destroying leftist "Timer ${id}" with FACTS and LOGIC`)
    }

    // Array of timers from index
    const {timers} = await import(".")

    // The current timer
    const timer = timers[numericId]

    if (timer === undefined) {
        channel.send(`:confused: Could not find timer with id ${id}`)
    } else if (isauthorizedToModifyTimer(member, author, timer)) {
        timer.shouldmute = Boolean(shouldmute)
        timer.kill() // Run the `kill()` function
    } else {
        const mentionedMessage = timer.mentionedUid
            ? `, the mentioned user (${timer.mentionedUid}),`
            : ""

        channel.send(`Sorry <@${author.id}>, but you're not authorized to modify this protected timer. Only the timer creator (${timer.creator.username})${mentionedMessage} and those with the \`${adminRoleName}\` role may modify this timer.`)
    }
}

export default kill

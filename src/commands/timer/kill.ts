/**
 * Discord Debate Timer
 * @copyright 2020 - 2021 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.6.1
 * @license BSD-3-Clause
 */

import {deriveTimerId, isAuthorizedToModifyTimer} from "./utils"
import type {Message} from "discord.js"
import {adminRoleName} from "../../getConfig"
import {timers} from "."

/**
 * Kills a timer with id
 * @param param0 - message object with message info
 * @param id - timermessage.member.roles id - could be undefined, but shouldn't be
 * @returns void
 */
export const kill = (
    message: Message,
): void => {
    const {author, member, channel} = message
    let id = message.content.split(" ")[1]
    const shouldMute =
        message.content.split(" ")[2] === undefined ||
        message.content.split(" ")[2] === "mute"
    let numericId = Number(id)

    if (id === undefined) { // Id was never provided. Terminate.
        const derivedId = deriveTimerId(timers, author.id)
        const derivedNumericId = Number(derivedId)

        if (derivedId === undefined || isNaN(derivedNumericId)) {
            channel.send(":confused: Argument [id] not provided. For help using this command, run the `!help` command.")

            return
        }

        numericId = derivedNumericId
        id = derivedId
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

    // The current timer
    const timer = timers[numericId]

    if (timer === undefined) {
        channel.send(`:confused: Could not find timer with id ${id}`)
    } else if (isAuthorizedToModifyTimer(member, author, timer)) {
        timer.shouldMute = Boolean(shouldMute)
        timer.kill() // Run the `kill()` function
    } else {
        const mentionedMessage = timer.mentionedUid
            ? `, the mentioned user (${timer.mentionedUid}),`
            : ""

        channel.send(`Sorry <@${author.id}>, but you're not authorized to modify this protected timer. Only the timer creator (${timer.creator.username})${mentionedMessage} and those with the \`${adminRoleName.value}\` ${adminRoleName.type === "name" ? "role" : "permission"} may modify this timer.`)
    }
}

export default kill

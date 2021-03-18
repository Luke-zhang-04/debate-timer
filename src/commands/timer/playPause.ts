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
 * Pauses a timer with id
 * @param param0 - message object with message info
 * @param id - timer id - could be undefined, but shouldn't be
 * @returns void
 */
export const playPause = (
    {author, member, channel}: Message,
    _id?: string,
    playOrPause?: "resume" | "pause",
): void => {
    let id = _id
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

    channel.send(`Looking for timer with id ${id}`)

    // The current timer
    const timer = timers[numericId]

    if (timer === undefined) {
        channel.send(`:confused: Could not find timer with id ${id}`)
    } else if (isAuthorizedToModifyTimer(member, author, timer)) {
        timer.playPause(playOrPause)

        channel.send(`${playOrPause === "pause" ? "Paused" : "Continuing"} timer with id ${id}`)
    } else {
        const mentionedMessage = timer.mentionedUid
            ? `, the mentioned user (${timer.mentionedUid}),`
            : ""

        channel.send(`Sorry <@${author.id}>, but you're not authorized to modify this protected timer. Only the timer creator (${timer.creator.username})${mentionedMessage} and those with the \`${adminRoleName.value}\` ${adminRoleName.type === "name" ? "role" : "permission"} may modify this timer.`)
    }
}

export const pause = (message: Message): void => {
    playPause(
        message, message.content.split(" ")[1], "pause",
    )
}

export const resume = (message: Message): void => {
    playPause(
        message, message.content.split(" ")[1], "resume",
    )
}

export default playPause

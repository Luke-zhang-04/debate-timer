/**
 * Discord Debate Timer
 *
 * @license BSD-3-Clause
 * @version 1.9.0
 * @author Luke Zhang luke-zhang-04.github.io/
 * @copyright 2020 - 2021 Luke Zhang
 */

import {adminRoleName, verbosity} from "../../getConfig"
import {deriveTimerId, derivedIdIsValid, isAuthorizedToModifyTimer} from "./utils"
import {timers} from "."

/**
 * Pauses a timer with id
 *
 * @param param0 - Message object with message info
 * @param id - Timer id - could be undefined, but shouldn't be
 * @returns Void
 */
export const playPause = (
    message: Message,
    _id?: string,
    playOrPause?: "resume" | "pause",
): void => {
    const {author, member, channel} = message
    let id = _id
    let numericId = Number(id)

    if (id === undefined) {
        // Id was never provided. Terminate.
        const derivedId = deriveTimerId(timers, author.id)
        const derivedNumericId = Number(derivedId)

        if (!derivedIdIsValid(derivedId, derivedNumericId, message)) {
            return
        }

        numericId = derivedNumericId
        id = derivedId
    } else if (isNaN(numericId)) {
        // Id couldn't be parsed as a number. Terminate.
        channel.send(`:1234: Could not parse \`${id}\` as a number. Learn to count.`)

        return
    }

    if (verbosity === 2) {
        channel.send(`Looking for timer with id ${id}`)
    }

    // The current timer
    const timer = timers[numericId]

    if (timer === undefined) {
        channel.send(`:confused: Could not find timer with id ${id}`)
    } else if (isAuthorizedToModifyTimer(member, author, timer)) {
        timer.playPause(playOrPause)

        if (verbosity === 1) {
            message.react("\u2705")
        } else if (verbosity === 2) {
            channel.send(
                `${playOrPause === "pause" ? "Paused" : "Continuing"} timer with id ${id}`,
            )
        }
    } else {
        const mentionedMessage = timer.mentionedUid
            ? `, the mentioned user (${timer.mentionedUid}),`
            : ""

        channel.send(
            `Sorry <@${
                author.id
            }>, but you're not authorized to modify this protected timer. Only the timer creator (${
                timer.creator.username
            })${mentionedMessage} and those with the \`${adminRoleName.value}\` ${
                adminRoleName.type === "name" ? "role" : "permission"
            } may modify this timer.`,
        )
    }
}

export const pause = (message: Message): void => {
    playPause(message, message.content.split(" ")[1], "pause")
}

export const resume = (message: Message): void => {
    playPause(message, message.content.split(" ")[1], "resume")
}

export default playPause

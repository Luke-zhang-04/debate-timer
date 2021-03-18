/**
 * Discord Debate Timer
 * @copyright 2020 - 2021 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.7.0
 * @license BSD-3-Clause
 */

import {deriveTimerId, isAuthorizedToModifyTimer} from "./utils"
import type {Message} from "discord.js"
import {adminRoleName} from "../../getConfig"
import {timers} from "."

/**
 * Changes the time of a timer with id
 * @param param0 - message object with message info
 * @param id - id of timer - could be undefined, but shouldn't be
 * @param amt - the amount to change the timer - could be undefined, but shouldn't be
 * @returns void
 */
export const changeTime = (
    {author, member, channel}: Message,
    multiply: -1 | 1,
    id?: string,
    amt?: string,
): void => {
    let numericId = Number(id)
    let numericAmt = Number(amt) * multiply

    if (id === undefined) { // Id was never provided. Terminate.
        channel.send(":confused: Argument [id] not provided. For help using this command, run the `!help` command.")

        return
    } else if (isNaN(numericId)) { // Id couldn't be parsed as a number. Terminate.
        channel.send(`:1234: Could not parse \`${id}\` as a number. Learn to count.`)

        return
    }

    if (amt === undefined) {
        const derivedId = deriveTimerId(timers, author.id)
        const derivedNumericId = Number(derivedId)

        if (derivedId === undefined || isNaN(derivedNumericId)) {
            channel.send(":confused: Argument [amt] not provided. For help using this command, run the `!help` command.")

            return
        }

        numericAmt = numericId * multiply
        numericId = derivedNumericId
    } else if (isNaN(numericAmt)) { // Id couldn't be parsed as a number. Terminate.
        channel.send(`:1234: Could not parse \`${amt}\` as a number. Learn to count.`)

        return
    }

    if (numericAmt === 0) {
        channel.send(":1234: Changing the timer by 0 does nothing. Learn to add.")

        return
    }

    // The current timer
    const timer = timers[numericId]

    if (timer === undefined) {
        channel.send(`:confused: Could not find timer with id ${id}`)
    } else if (isAuthorizedToModifyTimer(member, author, timer)) {
        if (numericAmt > 0) {
            channel.send(`Winding timer ${id} forward by ${numericAmt} seconds`)
        } else {
            channel.send(`Winding timer ${id} backwards by ${-numericAmt} seconds`)
        }

        timer.changeTime(numericAmt)
    } else {
        const mentionedMessage = timer.mentionedUid
            ? `, the mentioned user (${timer.mentionedUid}),`
            : ""

        channel.send(`Sorry <@${author.id}>, but you're not authorized to modify this protected timer. Only the timer creator (${timer.creator.username})${mentionedMessage} and those with the \`${adminRoleName.value}\` ${adminRoleName.type === "name" ? "role" : "permission"} may modify this timer.`)
    }
}

/**
 * Change the time of a timer
 * @param message - message object
 * @param mode - positive to decrease time, negative to increase
 */
export default (message: Message, mode: -1 | 1): void => {
    const content = message.content.split(" ")

    changeTime(message, mode, content[1], content[2])
}

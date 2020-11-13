/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.3.1
 * @license BSD-3-Clause
 */


import type {Message} from "discord.js"
import {adminRoleName} from "../../getConfig"
import {isauthorizedToModifyTimer} from "./utils"

/**
 * Changes the time of a timer with id
 * @param param0 - message object with message info
 * @param id - id of timer - could be undefined, but shouldn't be
 * @param amt - the amount to change the timer - could be undefined, but shouldn't be
 * @returns void
 */
export const changeTime = async (
    {author, member, channel}: Message,
    multiply: -1 | 1,
    id?: string,
    amt?: string,
): Promise<void> => {
    const numericId = Number(id)
    const numericAmt = Number(amt) * multiply

    if (id === undefined) { // Id was never provided. Terminate.
        channel.send(":confused: Argument [id] not provided. For help using this command, run the `!help` command.")

        return
    } else if (isNaN(numericId)) { // Id couldn't be parsed as a number. Terminate.
        channel.send(`:1234: Could not parse \`${id}\` as a number. Learn to count.`)

        return
    }

    if (amt === undefined) {
        channel.send(":confused: Argument [amt] not provided. For help using this command, run the `!help` command.")

        return
    } else if (isNaN(numericAmt)) { // Id couldn't be parsed as a number. Terminate.
        channel.send(`:1234: Could not parse \`${amt}\` as a number. Learn to count.`)

        return
    }

    if (numericAmt === 0) {
        channel.send(":1234: Changing the timer by 0 does nothing. Learn to add.")

        return
    }

    const {timers} = await import(".")
    const timer = timers[numericId]

    if (timer === undefined) {
        channel.send(`:confused: Could not find timer with id ${id}`)
    } else if (isauthorizedToModifyTimer(member, author, timer)) {
        if (numericAmt > 0) {
            channel.send(`Winding timer ${id} forward by ${numericAmt} seconds`)
        } else {
            channel.send(`Winding timer ${id} backwards by ${-numericAmt} seconds`)
        }

        timer.changeTime(numericAmt)
    } else {
        channel.send(`Sorry <@${author.id}>, but you're not authorized to modify this protected timer. Only <@${timer.creator.id}> of the timer and those with the \`${adminRoleName}\` role may modify this timer.`)
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

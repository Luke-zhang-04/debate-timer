/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.4.0
 * @license BSD-3-Clause
 */

import {GoogleSpreadsheet, GoogleSpreadsheetCell} from "google-spreadsheet"
import type {Message} from "discord.js"
import dotenv from "dotenv"
import {maxMotions} from "../getConfig"

if (!process.env.APIKEY) {
    dotenv.config()
}

// Google spreadsheet from hellomotions
const doc = new GoogleSpreadsheet("1qQlqFeJ3iYbzXYrLBMgbmT6LcJLj6JcG3LJyZSbkAJY")

// We use this promise so we can tell when the document it loaded
const docDidLoad = (async (): Promise<void> => {
    try {
        doc.useApiKey(process.env.APIKEY)
        await doc.loadInfo()

        return
    } catch (err) {
        console.error(err)
    }
})()

/**
 * Get a random integer between min and max
 * @param min - start number; inclusive
 * @param max - end number; exclusive
 * @returns random integer
 */
const randint = (min: number, max: number): number => {
    const _min = Math.ceil(min)
    const _max = Math.floor(max)

    return Math.floor(Math.random() * (_max - _min) + _min)
}

/**
 * Gets a random motion from the hellomotions motions spreadsheet
 * @see {@link https://docs.google.com/spreadsheets/d/1qQlqFeJ3iYbzXYrLBMgbmT6LcJLj6JcG3LJyZSbkAJY/edit#gid=2007846678}
 * @returns promise with a motion
 */
export const getRandomMotion = async (): Promise<string> => {
    await docDidLoad // Make sure doc was properly loaded

    let motion: string | number | boolean | null = null

    while (motion === null) {
        const sheet = doc.sheetsById["2007846678"] // Motions sheet
        const row = randint(2, sheet.rowCount) // Random row

        /* eslint-disable no-await-in-loop */
        // OK in this situation b/c the loop usually will run once
        await sheet.loadCells(`A${row}:X${row}`) // Load cell from random row
        /* eslint-enable no-await-in-loop */

        motion = sheet.getCellByA1(`S${row}`).value // Get motion from column
    }

    return motion.toString()
}

/**
 * Gets multiple random motions as defined in the message content
 * @param message - message object so we can get it's contents and send messages back
 * @returns Promise<void>
 */
export const getRandomMotions = async (message: Message): Promise<void> => {
    await docDidLoad

    type MotionResult = string | number | boolean | null | GoogleSpreadsheetCell

    const motions: Promise<string | GoogleSpreadsheetCell>[] = [] // Array of motions
    const rowsUsed: number[] = [] // Keep track of rows used to prevent duplicates
    const sheet = doc.sheetsById["2007846678"] // Motions sheet
    let motionsString = "",
        amt = Number(message.content.split(" ")[1] ?? 5) // Number of motions

    if (isNaN(amt)) { // Not a number
        message.channel.send(`:1234: Could not parse \`${message.content.split(" ")[1]}\` as a number. Learn to count.`)

        return
    } else if (amt > maxMotions) {
        message.channel.send(`:tired_face: Requested a total of ${amt} motions. That's too much power for me to handle. I'll be sending you ${maxMotions} motions.`)
        amt = maxMotions
    } else if (amt < 0) {
        message.channel.send(`:1234: Requested a total of ${amt} motions. That's smaller than 0 (yes, I can count).\nBruh.`)

        return
    }

    for (let _ = 0; _ < amt; _++) {
        let row = randint(2, sheet.rowCount)

        while (rowsUsed.includes(row)) { // Make sure random row hasn't already been used
            row = randint(2, sheet.rowCount)
        }

        rowsUsed.push(row)

        // Push a Promise with a random motion to motions
        motions.push(sheet.loadCells(`A${row}:X${row}`).then(() => (
            sheet.getCellByA1(`S${row}`)
        )))
    }

    // Wait for Promises to resolve, then add them to motionsString
    await Promise.all(motions).then(async (_motions) => {
        for (const [index, motion] of _motions.entries()) {
            let formattedMotion: MotionResult = motion

            if (typeof formattedMotion !== "string") {
                /* eslint-disable no-await-in-loop */
                // OK in this situation b/c the loop usually will run once
                formattedMotion =
                    formattedMotion.value?.toString() ?? await getRandomMotion()
                /* eslint-enable no-await-in-loop */
            }

            motionsString += `\n\n${index + 1}. ${formattedMotion}`
        }
    })
        .catch(() => "***Error :sweat_smile:***")

    message.channel
        .send(`:speaking_head: **Got random motions**: ${motionsString}`)
        .catch((err) => (
            err instanceof Error
                ? message.channel.send(`${err.name}: ${err.message}. Solution: try again.`)
                : message.channel.send(JSON.stringify(err))
        ))
}

export default {
    getRandomMotion,
    getRandomMotions,
}

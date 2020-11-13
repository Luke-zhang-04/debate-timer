/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.3.1
 * @license BSD-3-Clause
 */

import {GoogleSpreadsheet} from "google-spreadsheet"
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
 * @see {@link https://docs.google.com/spreadsheets/d/1qQlqFeJ3iYbzXYrLBMgbmT6LcJLj6JcG3LJyZSbkAJY/edit?usp=sharing}
 * @returns promise with a motion
 */
export const getRandomMotion = async (): Promise<string> => {
    await docDidLoad // Make sure doc was properly loaded

    const [sheet] = doc.sheetsByIndex // First sheet
    const row = randint(2, sheet.rowCount) // Random row

    await sheet.loadCells(`A${row}:X${row}`) // Load cell from random row

    const motion = sheet.getCellByA1(`S${row}`).value // Get motion from column S

    return motion.toString()
}

/**
 * Gets multiple random motions as defined in the message content
 * @param message - message object so we can get it's contents and send messages back
 * @returns Promise<void>
 */
export const getRandomMotions = async (message: Message): Promise<void> => {
    await docDidLoad

    const motions: Promise<string>[] = [] // Array of motions
    const rowsUsed: number[] = [] // Keep track of rows used to prevent duplicates
    const [sheet] = doc.sheetsByIndex // First sheel
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
            sheet.getCellByA1(`S${row}`).value.toString()
        )))
    }

    // Wait for Promises to resolve, then add them to motionsString
    await Promise.all(motions).then((_motions) => {
        for (const [index, motion] of _motions.entries()) {
            motionsString += `\n\n${index + 1}. ${motion}`
        }
    })

    message.channel.send(`:speaking_head: **Got random motions**: ${motionsString}`)
}

export default {
    getRandomMotion,
    getRandomMotions,
}

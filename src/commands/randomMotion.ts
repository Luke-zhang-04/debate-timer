/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.6.0
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

// We use this promise so we can tell when the document is loaded
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

    // Final motion
    let motion: string | number | boolean | null = null

    // Info slide if provided
    let infoSlide = ""

    while (motion === null) {
        // Motions sheet
        const sheet = doc.sheetsById["2007846678"]

        // Random row
        const row = randint(2, sheet.rowCount)

        /* eslint-disable no-await-in-loop */
        // OK in this situation b/c the loop usually will run once
        await sheet.loadCells(`S${row}:T${row}`) // Load cell from random row
        /* eslint-enable no-await-in-loop */

        motion = sheet.getCellByA1(`S${row}`).value // Get motion from column
        infoSlide = sheet.getCellByA1(`T${row}`).value?.toString() ?? "" // Get the infoslide (if any)
    }

    if (infoSlide) {
        infoSlide += "\n\nMotion: "
    }

    return `${infoSlide}${motion.toString()}`
}

export const sendRandomMotion = async (message: Message): Promise<Message> => (
    message.channel.send(`:speaking_head: ${await getRandomMotion()}`)
)

/**
 * Groups the motions into the largest size possible for the Discord API
 * message size
 * @param motions - array of motions
 * @return chunked motions
 */
const motionsToChumks = (motions: string[]): string[] => {
    const splitMotions = [":speaking_head: **Got random motions**:"]
    const maxMessageLength = 2_000 // Discord's max message length
    let index = 0

    for (const motion of motions) {
        if ( // The current chunk of motions will not exceed the message size limit
            (splitMotions[index] ??= "").length + motion.length <
                maxMessageLength
        ) {
            splitMotions[index] += `\n\n${motion}`
        } else { // Adding a new motion will surpass the maximum, so we create a new chunk
            index++
            splitMotions.push(`_ _\n${motion}`)
        }
    }

    return splitMotions
}

/**
 * Gets multiple random motions as defined in the message content
 * @param message - message object so we can get it's contents and send messages back
 * @returns Promise<void>
 */
export const sendRandomMotions = async (message: Message): Promise<void> => {
    await docDidLoad

    // Array of motions
    const motions: Promise<[
        motion: string | null,
        infoSlide: string | null,
    ]>[] = []

    // Keep track of rows used to prevent duplicates
    const rowsUsed: number[] = []

    // Motions sheet
    const sheet = doc.sheetsById["2007846678"]

    // Final message that will be sent
    const motionsStrings: string[] = []

    // Number of motions
    let amt = Number(message.content.split(" ")[1] ?? 5)

    if (isNaN(amt)) {
        message.channel.send(`:1234: Could not parse \`${message.content.split(" ")[1]}\` as a number. Learn to count.`)

        return
    } else if (amt > maxMotions) {
        message.channel.send(`:tired_face: Requested a total of ${amt} motions. That's too much power for me to handle. I'll be sending you ${maxMotions} motions.`)
        amt = maxMotions
    } else if (amt < 0) {
        message.channel.send(`:1234: Requested a total of ${amt} motions. That's smaller than 0 (yes, I can count).`)

        return
    }

    for (let _ = 0; _ < amt; _++) {
        let row = randint(2, sheet.rowCount)

        while (rowsUsed.includes(row)) { // Make sure random row hasn't already been used
            row = randint(2, sheet.rowCount)
        }

        rowsUsed.push(row)

        // Push a Promise with a random motion to motions
        motions.push(sheet.loadCells(`S${row}:T${row}`).then(() => [
            sheet.getCellByA1(`S${row}`).value?.toString(),
            sheet.getCellByA1(`T${row}`).value?.toString(),
        ]))
    }

    // Wait for Promises to resolve, then add them to motionsString
    await Promise.all(motions).then(async (_motions) => {
        for (const [index, [motion, infoSlide]] of _motions.entries()) {
            let formattedMotion: string = infoSlide
                ? `*Info Slide:* ${infoSlide}\n\n*Motion:* `
                : ""

            /* eslint-disable no-await-in-loop */
            // OK in this situation b/c the loop usually will run once
            formattedMotion += motion ?? await getRandomMotion()
            /* eslint-enable no-await-in-loop */

            motionsStrings.push(`**${index + 1}.** ${formattedMotion}`)
        }
    })
        .catch(() => "***Error :sweat_smile:***")

    for (const motion of motionsToChumks(motionsStrings)) {
        /* eslint-disable no-await-in-loop */
        // OK in this situation b/c the loop usually will run once or twice
        await message.channel
            .send(motion)
            .catch((err) => (
                err instanceof Error
                    ? message.channel.send(`${err.name}: ${err.message} Solution: try again.`)
                    : message.channel.send(JSON.stringify(err))
            ))
        /* eslint-enable no-await-in-loop */
    }
}

export default {
    getRandomMotion,
    getRandomMotions: sendRandomMotions,
    sendRandomMotion,
}

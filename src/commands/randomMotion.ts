/**
 * Discord Debate Timer
 *
 * @license BSD-3-Clause
 * @author Luke Zhang luke-zhang-04.github.io/
 * @copyright 2020 - 2021 Luke Zhang
 */

import {GoogleSpreadsheet, GoogleSpreadsheetWorksheet} from "google-spreadsheet"
import {niceTryPromise, randint} from "../utils"
import dotenv from "dotenv"
import {maxMotions} from "../getConfig"

type Motion = [motion: string, infoSlide: string]

if (!process.env.APIKEY) {
    dotenv.config()
}

// Google spreadsheet from hellomotions
const doc = new GoogleSpreadsheet("1qQlqFeJ3iYbzXYrLBMgbmT6LcJLj6JcG3LJyZSbkAJY")

let sheet: GoogleSpreadsheetWorksheet | undefined

const loadSheet = async (): Promise<GoogleSpreadsheetWorksheet> => {
    doc.useApiKey(process.env.APIKEY)
    await doc.loadInfo()

    return doc.sheetsById["2007846678"]
}

/**
 * Gets a motion from a row by checking the cache first
 *
 * @param row - Row to get motion from
 * @returns Motion and infoslide
 */
const getMotionFromRow = async (row: number): Promise<Motion> => {
    const motion = await niceTryPromise(
        async () => (sheet ??= await loadSheet()).getCellByA1(`S${row}`).value?.toString() ?? "",
    )

    if (motion === undefined) {
        await (sheet ??= await loadSheet()).loadCells(`S${row}:T${row}`) // Load cell from random row
    }

    console.log(sheet?.cellStats)

    return [
        motion ?? (sheet ??= await loadSheet()).getCellByA1(`S${row}`).value?.toString() ?? "",
        (sheet ??= await loadSheet()).getCellByA1(`T${row}`).value?.toString() ?? "",
    ]
}

/**
 * Gets a random motion from the hellomotions motions spreadsheet
 *
 * @returns Promise with a motion
 * @see {@link https://docs.google.com/spreadsheets/d/1qQlqFeJ3iYbzXYrLBMgbmT6LcJLj6JcG3LJyZSbkAJY/edit#gid=2007846678}
 */
export const getRandomMotion = async (): Promise<string> => {
    // Final motion
    let motion: string | null = null

    // Info slide if provided
    let infoSlide = ""

    while (motion === null) {
        // Random row
        const row = randint(2, (sheet ??= await loadSheet()).rowCount)
        const cell = await getMotionFromRow(row)

        motion = cell[0]
        infoSlide = cell[1]
    }

    if (infoSlide) {
        infoSlide += "\n\nMotion: "
    }

    return `${infoSlide}${motion}`
}

/**
 * Groups the motions into the largest size possible for the Discord API message size
 *
 * @param motions - Array of motions
 * @returns Chunked motions
 */
const motionsToChunks = (motions: string[]): string[] => {
    const splitMotions = [":speaking_head: **Got random motions**:"]
    const maxMessageLength = 2_000 // Discord's max message length
    let index = 0

    for (const motion of motions) {
        if (
            // The current chunk of motions will not exceed the message size limit
            (splitMotions[index] ??= "").length + motion.length <
            maxMessageLength
        ) {
            splitMotions[index] += `\n\n${motion}`
        } else {
            // Adding a new motion will surpass the maximum, so we create a new chunk
            index++
            splitMotions.push(`_ _\n${motion}`)
        }
    }

    return splitMotions
}

/**
 * Gets multiple random motions as defined in the message content
 *
 * @param message - Message object so we can get it's contents and send messages back
 * @returns Promise<void>
 */
export const sendRandomMotions = async (message: Message): Promise<void> => {
    try {
        // Array of motions
        const motions: Promise<Motion>[] = []

        // Keep track of rows used to prevent duplicates
        const rowsUsed: number[] = []

        // Final message that will be sent
        const motionsStrings: string[] = []

        // Number of motions
        let amt = Number(message.content.split(" ")[1] ?? 5)

        if (isNaN(amt)) {
            await message.channel.send(
                `:1234: Could not parse \`${
                    message.content.split(" ")[1]
                }\` as a number. Learn to count.`,
            )

            return
        } else if (amt > maxMotions) {
            message.channel.send(
                `:tired_face: Requested a total of ${amt} motions. That's too much power for me to handle. I'll be sending you ${maxMotions} motions.`,
            )
            amt = maxMotions
        } else if (amt < 0) {
            await message.channel.send(
                `:1234: Requested a total of ${amt} motions. That's smaller than 0 (yes, I can count).`,
            )

            return
        }

        for (let _ = 0; _ < amt; _++) {
            let row = randint(2, (sheet ??= await loadSheet()).rowCount)

            while (rowsUsed.includes(row)) {
                // Make sure random row hasn't already been used
                row = randint(2, sheet.rowCount)
            }

            rowsUsed.push(row)

            // Push a Promise with a random motion to motions
            motions.push(getMotionFromRow(row))
        }

        // Wait for Promises to resolve, then add them to motionsString
        const err = await Promise.all(motions)
            .then(async (_motions) => {
                for (const [index, [motion, infoSlide]] of _motions.entries()) {
                    let formattedMotion: string = infoSlide
                        ? `*Info Slide:* ${infoSlide}\n\n*Motion:* `
                        : ""

                    /* eslint-disable no-await-in-loop */
                    // OK in this situation b/c the loop usually will run once
                    formattedMotion += motion ?? (await getRandomMotion())
                    /* eslint-enable no-await-in-loop */

                    motionsStrings.push(`**${index + 1}.** ${formattedMotion}`)
                }
            })
            .catch(
                (_err) =>
                    `An error occured:\n\`\`\`\n${
                        _err instanceof Error ? _err.toString() : _err
                    }\n\`\`\``,
            )

        if (err) {
            await message.channel.send(err)

            return
        } else if (motionsStrings.length === 0) {
            await message.channel.send(
                "Couldn't get your motions. We might've surpassed Google API limits, please try again in a few seconds",
            )

            return
        }

        for (const motion of motionsToChunks(motionsStrings)) {
            /* eslint-disable no-await-in-loop */
            // OK in this situation b/c the loop usually will run once or twice
            await message.channel
                .send(motion)
                .catch((_err) =>
                    _err instanceof Error
                        ? message.channel.send(
                              `${_err.name}: ${_err.message} Solution: try again.`,
                          )
                        : message.channel.send(JSON.stringify(_err)),
                )
            /* eslint-enable no-await-in-loop */
        }
    } catch (err: unknown) {
        const error = err instanceof Error ? err : new Error(String(err))

        message.channel.send(`An error occured:\n\`\`\`${error.name}\n${error.message}\n\`\`\``)
    }
}

export const sendRandomMotion = async (message: Message): Promise<void> => {
    try {
        const numberArg = Number(message.content.split(" ")[1])

        if (isNaN(numberArg)) {
            await message.channel.send(`:speaking_head: ${await getRandomMotion()}`)
        } else {
            await message.channel.send(
                "You ran the command `getMotion` (singular) with a number. Assuming user meant `getMotions`.",
            )
            await sendRandomMotions(message)
        }
    } catch (err: unknown) {
        const error = err instanceof Error ? err : new Error(String(err))

        message.channel.send(`An error occured:\n\n\`\`\`${error.name}\n${error.message}\`\`\``)
    }
}

export default {
    getRandomMotion,
    getRandomMotions: sendRandomMotions,
    sendRandomMotion,
}

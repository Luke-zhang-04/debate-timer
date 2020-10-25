/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang, Ridwan Alam
 * @author Luke Zhang luke-zhang-04.github.io/
 * @license MIT
 */

import {GoogleSpreadsheet} from "google-spreadsheet"
import type {Message} from "discord.js"

const doc = new GoogleSpreadsheet("1qQlqFeJ3iYbzXYrLBMgbmT6LcJLj6JcG3LJyZSbkAJY")

const docDidLoad = new Promise(async (resolve, reject) => {
    try {
        doc.useApiKey("AIzaSyC47H9Aak3mC7a28FoAqNtN24ttte5Z270")
        await doc.loadInfo()

        return resolve()
    } catch (err) {
        reject(err)
    }
})

const randint = (min: number, max: number): number => {
    min = Math.ceil(min)
    max = Math.floor(max)

    return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
}

export const getRandomMotion = async (): Promise<string> => {
    await docDidLoad

    const [sheet] = doc.sheetsByIndex
    const row = randint(2, sheet.rowCount)

    await sheet.loadCells(`A${row}:X${row}`)

    const motion = sheet.getCellByA1(`S${row}`).value

    return motion.toString()
}

export const getRandomMotions = async (
    message: Message,
): Promise<void> => {
    await docDidLoad

    const motions: Promise<string>[] = []
    const rowsUsed: number[] = []
    const [sheet] = doc.sheetsByIndex
    let motionsString = ""
    let amt = Number(message.content.split(" ")[1] ?? 5)

    if (isNaN(amt)) {
        message.channel.send(`Could not parse \`${message.content.split(" ")[1]}\` as a number. Learn to count.`)

        return
    }

    if (amt > 20) {
        message.channel.send(`Requested a total of ${amt} motions. That's too much power for me to handle. I'll be sending you 20 motions.`)
        amt = 20
    } else if (amt < 0) {
        message.channel.send(`Requested a total of ${amt} motions. That's smaller than 0 (yes, I can count).\nBruh.`)
        return
    }

    for (let _ = 0; _ < amt; _++) {
        let row = randint(2, sheet.rowCount)

        while (rowsUsed.includes(row)) {
            row = randint(2, sheet.rowCount)
        }

        rowsUsed.push(row)
        motions.push(sheet.loadCells(`A${row}:X${row}`).then(() => (
            sheet.getCellByA1(`S${row}`).value.toString()
        )))
    }

    await Promise.all(motions).then((motions) => {
        for (const [index, motion] of motions.entries()) {
            motionsString += `\n\n${index + 1}. ${motion}`
        }
    })

    message.channel.send(`**Generated random motions**: ${motionsString}`)
}

export default {
    getRandomMotion,
    getRandomMotions,
}

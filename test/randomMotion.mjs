/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @license MIT
 */
import {Message} from "./utils/mockDiscord.mjs"
import assert from "assert"
import motion from "../lib/commands/randomMotion.js"
import testHelpers from "./utils/helpers.mjs"

export default () => {
    it("Should give a random motion", () => new Promise(async (resolve) => {
        const _motion = await motion.default.getRandomMotion()

        assert.strictEqual(typeof _motion, "string")

        resolve()
    }))

    it("Should give 5 random motions by default", () => (
        new Promise(async (resolve) => {
            const message = new Message("!getMotions")

            await motion.default.getRandomMotions(message)

            const returnMsg = message.newMessage.content

            testHelpers.includes(returnMsg, "**Got random motions**")
            testHelpers.includes(returnMsg, "1.")
            testHelpers.includes(returnMsg, "5.")
            testHelpers.notIncludes(returnMsg, "\n6.")

            resolve()
        })
    ))

    it("Should give 6 random motions", () => new Promise(async (resolve) => {
        const message = new Message("!getMotions 6")

        await motion.default.getRandomMotions(message)

        const returnMsg = message.newMessage.content

        testHelpers.includes(returnMsg, "**Got random motions**")
        testHelpers.includes(returnMsg, "1.")
        testHelpers.includes(returnMsg, "6.")
        testHelpers.notIncludes(returnMsg, "\n7.")

        resolve()
    }))

    it("Should max out at 20 motions", () => new Promise(async (resolve) => {
        const message = new Message("!getMotions 50")

        await motion.default.getRandomMotions(message)

        const returnMsg = message.newMessage.content

        testHelpers.includes(returnMsg, "**Got random motions**")
        testHelpers.includes(returnMsg, "1.")
        testHelpers.includes(returnMsg, "20.")
        testHelpers.notIncludes(returnMsg, "\n21.")

        resolve()
    }))

    it("Should send a message if less than 0 motions passed", () => (
        new Promise(async (resolve) => {
            const message = new Message("!getMotions -3")

            await motion.default.getRandomMotions(message)

            const returnMsg = message.newMessage.content

            testHelpers.includes(returnMsg, "smaller than 0")

            resolve()
        })
    ))

    it("Should send a message if motion count is not a number", () => (
        new Promise(async (resolve) => {
            const message = new Message("!getMotions notanumber")

            await motion.default.getRandomMotions(message)

            const returnMsg = message.newMessage.content

            testHelpers.includes(returnMsg, "Learn to count")

            resolve()
        })
    ))
}

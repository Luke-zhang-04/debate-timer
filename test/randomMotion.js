/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.6.0
 * @license BSD-3-Clause
 */

import {Message} from "./utils/mockDiscord.js"
import assert from "assert"
import motion from "../lib/commands/randomMotion.js"
import testHelpers from "./utils/helpers.js"

export default () => {
    it("Should give a random motion", async () => {
        const _motion = await motion.default.getRandomMotion()

        assert.strictEqual(typeof _motion, "string")
    })

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

    it("Should give a specified number of random motions", async () => {
        const message = new Message("!getMotions 3")

        await motion.default.getRandomMotions(message)

        const returnMsg = message.newMessage.content

        testHelpers.includes(returnMsg, "**Got random motions**")
        testHelpers.includes(returnMsg, "1.")
        testHelpers.includes(returnMsg, "3.")
        testHelpers.notIncludes(returnMsg, "\n4.")
    })

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

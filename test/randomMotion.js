/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.3.1
 * @license BSD-3-Clause
 */

const {Message} = require("./utils/mockDiscord")
const assert = require("assert")
const motion = require("../lib/commands/randomMotion")
const testHelpers = require("./utils/helpers")

module.exports = () => {
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
        const message = new Message("!getMotions 6")

        await motion.default.getRandomMotions(message)

        const returnMsg = message.newMessage.content

        testHelpers.includes(returnMsg, "**Got random motions**")
        testHelpers.includes(returnMsg, "1.")
        testHelpers.includes(returnMsg, "6.")
        testHelpers.notIncludes(returnMsg, "\n7.")
    })

    it("Should max out at 20 motions", async () => {
        const message = new Message("!getMotions 50")

        await motion.default.getRandomMotions(message)

        const returnMsg = message.newMessage.content

        testHelpers.includes(returnMsg, "**Got random motions**")
        testHelpers.includes(returnMsg, "1.")
        testHelpers.includes(returnMsg, "20.")
        testHelpers.notIncludes(returnMsg, "\n21.")
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

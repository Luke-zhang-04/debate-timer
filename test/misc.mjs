/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @license MIT
 */
import {Message} from "./utils/mockDiscord.mjs"
import assert from "assert"
import handleMessage from "../lib/handleMessage.js"
import testHelpers from "./utils/helpers.mjs"


export default () => {
    it("Should do nothing if author was a bot", () => {
        const message = new Message("!help", {author: {bot: true}})

        handleMessage.default(message)

        assert.strictEqual(message.newMessage, undefined)
    })

    it("Should give greeting if only prefix was specified", () => {
        const message = new Message("!")

        handleMessage.default(message)

        const returnMsg = message.newMessage.content

        testHelpers.includes(returnMsg, "Hey there!")
    })

    it("Should send a message if curse word is detected", () => {
        const message = new Message("ass")

        handleMessage.default(message)

        const returnMsg = message.newMessage.content

        try {
            testHelpers.includesOneof(returnMsg, "swear", "mouth", "not very nice")
        } catch (err) {
            if (!message.newMessage.files) {
                throw err
            }
        }

        testHelpers.includes(returnMsg, "@Tester")
    })

    it("Should send message if unknown command was specified", () => {
        const message = new Message("!notACommand")

        handleMessage.default(message)

        const returnMsg = message.newMessage.content

        testHelpers.includes(returnMsg, "is not recognized")
    })
}

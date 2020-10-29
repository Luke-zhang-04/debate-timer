/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.1.1
 * @license BSD-3-Clause
 */

const {Message} = require("./utils/mockDiscord")
const assert = require("assert")
const handleMessage = require("../lib/handleMessage")
const {hostname} = require("os")
const systemInfo = require("../lib/commands/systemInfo")
const testHelpers = require("./utils/helpers")


module.exports = () => {
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

    it("Should output accurate system info", async () => {
        const info = systemInfo.default()

        testHelpers.includes(await info, hostname())
    })
}

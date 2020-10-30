/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.2.1
 * @license BSD-3-Clause
 */

const {Client, Message} = require("./utils/mockDiscord")
const assert = require("assert")
const handleMessage = require("../lib/handleMessage")
const poll = require("../lib/commands/poll")
const testHelpers = require("./utils/helpers")

module.exports = () => {
    it("Should create a poll", () => {
        const client = new Client()
        const msg = new Message("!poll")

        handleMessage.default(msg, client)

        const returnMsg = msg.newMessage.content

        testHelpers.includes(returnMsg, "Starting a poll")
        testHelpers.includes(returnMsg, "React here")
    })

    it("Should create and make a poll properly", async () => {
        const client = new Client()
        const msg = new Message("!poll")
        const reactPromises = []

        await poll.makePoll(msg, client)

        for (let userNum = 0; userNum < 10; userNum++) {
            reactPromises.push(
                msg.newMessage.react(
                    `user${userNum}`,
                    userNum <= 7 ? "emoji_1" : "emoji_2",
                    client,
                )
            )
        }

        await Promise.all(reactPromises)

        const newMsg = new Message("!getPoll")

        handleMessage.default(newMsg, client)

        const returnMsg = newMsg.newMessage.content

        testHelpers.includes(returnMsg, "Debaters: <@user0>")
        testHelpers.includes(returnMsg, "<@user6>")
        testHelpers.includes(returnMsg, "Spectators: <@user8>")
        testHelpers.includes(returnMsg, "<@user9>")
    })

    it("Should not take more than 8 debaters", async () => {
        const client = new Client()
        const msg = new Message("!poll")
        const reactPromises = []

        await poll.makePoll(msg, client)

        for (let userNum = 0; userNum < 9; userNum++) {
            reactPromises.push(
                msg.newMessage.react(`user${userNum}`, "emoji_1", client)
            )
        }

        await Promise.all(reactPromises)

        const returnMsg = msg.newMessage.content

        assert.strictEqual(returnMsg, "Sorry, there are already 8 debaters.")
    })
}

/**
 * Discord Debate Timer
 *
 * @license BSD-3-Clause
 * @version 1.8.0
 * @author Luke Zhang luke-zhang-04.github.io/
 * @copyright 2020 - 2021 Luke Zhang
 */

import {Client, Message} from "./utils/mockDiscord.js"
import handleMessage from "../lib/handleMessage.js"
import poll from "../lib/commands/poll.js"
import testHelpers from "./utils/helpers.js"

export default () => {
    it("Should create a poll", () => {
        const client = new Client()
        const msg = new Message("!poll")

        handleMessage.default(msg, client)

        const returnMsg = msg.newMessage.content

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
                    userNum <= 7 ? "762110857550757888" : "762112564787675156",
                ),
            )
        }

        await Promise.all(reactPromises)

        const newMsg = new Message("!getPoll")

        await handleMessage.default(newMsg, client)

        const returnMsg = newMsg.newMessage.content

        testHelpers.includes(returnMsg, "**debating**: <@user0>")
        testHelpers.includes(returnMsg, "<@user6>")
        testHelpers.includes(returnMsg, "**spectating**: <@user8>")
        testHelpers.includes(returnMsg, "<@user9>")

        const newMsg2 = new Message("!getPoll spectating")

        await handleMessage.default(newMsg2, client)

        testHelpers.includes(newMsg2.newMessage.content, "<@user9>")

        await handleMessage.default(newMsg, client)
    })
}

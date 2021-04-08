/**
 * Discord Debate Timer
 *
 * @license BSD-3-Clause
 * @version 1.7.0
 * @author Luke Zhang luke-zhang-04.github.io/
 * @copyright 2020 - 2021 Luke Zhang
 */

import {Message} from "./utils/mockDiscord.js"
import handleMessage from "../lib/handleMessage.js"
import testHelpers from "./utils/helpers.js"

export default () => {
    it("Should toss random teams", () => {
        const message = new Message("!makeTeams")

        handleMessage.default(message)

        const returnMsg = message.newMessage.content

        testHelpers.includes(returnMsg, "**OG**:")
        testHelpers.includes(returnMsg, "**CO**:")
        testHelpers.includes(returnMsg, "Team-B")
        testHelpers.includes(returnMsg, "Team-C")
    })

    it("Should toss random partners", () => {
        const message = new Message("!makePartners a b c d e f g h")

        handleMessage.default(message)

        const returnMsg = message.newMessage.content

        testHelpers.includes(returnMsg, "**Team-B**:")
        testHelpers.includes(returnMsg, "**Team-C**:")
        testHelpers.includesOneof(returnMsg, ": a", ", a")
        testHelpers.includesOneof(returnMsg, ": b", ", b")
    })
}

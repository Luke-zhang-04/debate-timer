/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.6.1
 * @license BSD-3-Clause
 */

import {Message} from "./utils/mockDiscord.js"
import handleMessage from "../lib/handleMessage.js"
import testHelpers from "./utils/helpers.js"


export default () => {
    it("Should show help message on !help", () => {
        const message = new Message("!help")

        handleMessage.default(message)

        const returnMsg = message.newMessage.content

        testHelpers.includes(returnMsg, "!start")
        testHelpers.includes(returnMsg, "!getMotion")
        testHelpers.includes(returnMsg, "!makeTeams")
    })

    it("Should show help message on !man", () => {
        const message = new Message("!man")

        handleMessage.default(message)

        const returnMsg = message.newMessage.content

        testHelpers.includes(returnMsg, "!start")
        testHelpers.includes(returnMsg, "!getMotion")
        testHelpers.includes(returnMsg, "!makeTeams")
    })

    it("Should have a manual entry for bruh", () => {
        const message = new Message("!help bruh")

        handleMessage.default(message)

        const returnMsg = message.newMessage.content

        testHelpers.includes(returnMsg, "B R U H")
    })

    it("Should have a manual entry for coinflip", () => {
        const message = new Message("!help coinflip")

        handleMessage.default(message)

        const returnMsg = message.newMessage.content

        testHelpers.includes(returnMsg, "Flip a coin")
    })

    it("Should have a manual entry for epic", () => {
        const message = new Message("!man !epic")

        handleMessage.default(message)

        const returnMsg = message.newMessage.content

        testHelpers.includes(returnMsg, "Ok, this is epic")
    })

    it("Should have a manual entry for start", () => {
        const message = new Message("!man start")

        handleMessage.default(message)

        const returnMsg = message.newMessage.content

        testHelpers.includes(returnMsg, "Starts a timer")
    })

    it("Should have a manual entry for kill", () => {
        const message = new Message("!man !kill")

        handleMessage.default(message)

        const returnMsg = message.newMessage.content

        testHelpers.includes(returnMsg, "Kills a timer")
    })

    it("Should have a manual entry for list", () => {
        const message = new Message("!man !list")

        handleMessage.default(message)

        const returnMsg = message.newMessage.content

        testHelpers.includes(returnMsg, "Lists the currently stored timers")
    })

    it("Should have a manual entry for resume", () => {
        const message = new Message("!help resume")

        handleMessage.default(message)

        const returnMsg = message.newMessage.content

        testHelpers.includes(returnMsg, "Continues a timer")
    })

    it("Should have a manual entry for pause", () => {
        const message = new Message("!help pause")

        handleMessage.default(message)

        const returnMsg = message.newMessage.content

        testHelpers.includes(returnMsg, "Pauses a timer")
    })

    it("Should have a manual entry for getMotion", () => {
        const message = new Message("!help getMotion")

        handleMessage.default(message)

        const returnMsg = message.newMessage.content

        testHelpers.includes(returnMsg, "random motion")
    })

    it("Should have a manual entry for getMotions", () => {
        const message = new Message("!help getMotions")

        handleMessage.default(message)

        const returnMsg = message.newMessage.content

        testHelpers.includes(returnMsg, "multiple motions")
    })

    it("Should have a manual entry for makePartners", () => {
        const message = new Message("!help makePartners")

        handleMessage.default(message)

        const returnMsg = message.newMessage.content

        testHelpers.includes(returnMsg, "random partners")
    })

    it("Should have a manual entry for makeRound", () => {
        const message = new Message("!help makeRound")

        handleMessage.default(message)

        const returnMsg = message.newMessage.content

        testHelpers.includes(returnMsg, "random draw")
        testHelpers.includes(returnMsg, "random motion")
    })

    it("Should have a manual entry for makeDraw", () => {
        const message = new Message("!help makeDraw")

        handleMessage.default(message)

        const returnMsg = message.newMessage.content

        testHelpers.includes(returnMsg, "random draw")
        testHelpers.includes(returnMsg, "positions and teams")
    })

    it("Should have a manual entry for poll", () => {
        const message = new Message("!help poll")

        handleMessage.default(message)

        const returnMsg = message.newMessage.content

        testHelpers.includes(returnMsg, "Creates a poll")
    })

    it("Should have a manual entry for getPoll", () => {
        const message = new Message("!help getPoll")

        handleMessage.default(message)

        const returnMsg = message.newMessage.content

        testHelpers.includes(returnMsg, "Gets data from current poll")
    })

    it("Should not have a manual entry for unknown command", () => {
        const message = new Message("!help notACommand")

        handleMessage.default(message)

        const returnMsg = message.newMessage.content

        testHelpers.includes(returnMsg, "No manual entry for notACommand")
    })

    it("Should give fuzzy matched manual entry", () => {
        const message = new Message("!hekp brug") // Help bruh

        handleMessage.default(message)

        const returnMsg = message.newMessage.content

        testHelpers.includes(returnMsg, "B R U H")
    })
}

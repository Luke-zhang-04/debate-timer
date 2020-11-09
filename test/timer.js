/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.3.0
 * @license BSD-3-Clause
 */

const {Message, Member} = require("./utils/mockDiscord")
const handleMessage = require("../lib/handleMessage")
const testHelpers = require("./utils/helpers")

module.exports = () => {
    context("Should start a timer properly", () => {
        const message = new Message(
            "!start @Tester",
            {
                author: {
                    bot: false,
                    id: "user1"
                }
            },
        )

        handleMessage.default(message)

        let returnMsg = message.newMessage.content,
            id

        it("Should have started a timer", () => {
            testHelpers.includes(returnMsg, "Starting timer")
        })

        it("Should show id", (done) => {
            setTimeout(() => {
                returnMsg = message.newMessage.content

                testHelpers.includes(returnMsg, "Id")
                testHelpers.includes(returnMsg, "Current time:")

                done()
            }, 500)
        })

        it("Should have ticked to 5 seconds", (done) => {
            setTimeout(() => {
                // eslint-disable-next-line
                id = returnMsg.split(" ")[3]

                returnMsg = message.newMessage.content

                testHelpers.includes(returnMsg, "Current time: 5")

                done()
            }, 4600)
        })

        it("Should not kill the timer if uauthorized", () => {
            const message2 = new Message(
                `!kill ${id}`,
                {
                    author: {
                        bot: false,
                        id: "user2"
                    }
                },
                new Member([], "user2"),
            )

            handleMessage.default(message2)

            const returnMsg2 = message2.newMessage.content

            testHelpers.includes(returnMsg2, "not authorized")
        })

        it("Should kill the timer properly if authorized", (done) => {
            setTimeout(() => {
                const message2 = new Message(
                    `!kill ${id}`,
                    {
                        author: {
                            bot: false,
                            id: "user1"
                        }
                    },
                    new Member([], "user1"),
                )

                handleMessage.default(message2)

                const returnMsg2 = message.newMessage.content

                testHelpers.includes(returnMsg2, "Killed timer")

                done()
            }, 100)
        })
    })

    context("Edge cases for the kill command", () => {
        it("Should send message if id is not provided", () => {
            const message = new Message("!kill")

            handleMessage.default(message)

            const returnMsg = message.newMessage.content

            testHelpers.includes(returnMsg, "not provided")
        })

        it("Should send message if id is not number", () => {
            const message = new Message("!kill notanumber")

            handleMessage.default(message)

            const returnMsg = message.newMessage.content

            testHelpers.includes(returnMsg, "Learn to count")
        })

        it("Should send a message if no timer with id is found", () => {
            const message = new Message("!kill 420")

            handleMessage.default(message)

            const returnMsg = message.newMessage.content

            testHelpers.includes(returnMsg, "Could not find timer")
        })
    })
}

/**
 * Discord Debate Timer
 * @copyright 2020 - 2021 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.7.0
 * @license BSD-3-Clause
 */

import {Message, Member} from "./utils/mockDiscord.js"
import handleMessage from "../lib/handleMessage.js"
import listCmd from "../lib/commands/timer/list.js"
import {strictEqual} from "assert"
import testHelpers from "./utils/helpers.js"

export default () => {
    context("Should start a timer properly", async () => {
        const message = new Message(
            "!start @Tester",
            {
                author: {
                    bot: false,
                    id: "user1",
                },
            },
        )

        await handleMessage.default(message)

        let returnMsg = message.newMessage.content,
            id

        it("Should have started a timer", () => {
            testHelpers.includes(returnMsg, "For: <@Tester>")
            testHelpers.includes(returnMsg, "Current time: 0")
        })

        it("Should show id", (done) => {
            setTimeout(() => {
                returnMsg = message.newMessage.content

                testHelpers.includes(returnMsg, "Id")
                testHelpers.includes(returnMsg, "Current time:")

                done()
            }, 500)
        })

        it("Should have ticked", (done) => {
            setTimeout(() => {
                // eslint-disable-next-line
                id = returnMsg.split(" ")[9]

                returnMsg = message.newMessage.content

                testHelpers.includes(returnMsg, "Current time:")
                strictEqual(id, "0")

                done()
            }, 1000)
        })

        context("Listing timers", async () => {
            for (let i = 0; i < 2; i++) {
                const timerForList = new Message(
                    "!start @Tester",
                    {
                        author: {
                            bot: false,
                            id: `user${i + 2}`,
                            username: `user${i + 2}`,
                        },
                    },
                )

                await handleMessage.default(timerForList)
            }

            it("Should list 2 timers for global", async () => {
                const listMsg = new Message("!list global")
                const {includes} = testHelpers

                await (
                    listCmd instanceof Function ? listCmd : listCmd.default
                )(listMsg) // Weird esmodules bug

                includes(listMsg.newMessage.content, "**1**")
                includes(listMsg.newMessage.content, "user2")
                includes(listMsg.newMessage.content, "**2**")
                includes(listMsg.newMessage.content, "user3")
            })

            it("Should list 1 timer for user", async () => {
                const listMsg = new Message(
                    "!list",
                    {
                        author: {
                            bot: false,
                            id: "user2",
                            username: "user2",
                        },
                    },
                )
                const {includes} = testHelpers

                await (
                    listCmd instanceof Function ? listCmd : listCmd.default
                )(listMsg) // Weird esmodules bug

                includes(listMsg.newMessage.content, "**1**")
                includes(listMsg.newMessage.content, "user2")
            })

            it("Should list 2 timers for Tester", async () => {
                const listMsg = new Message(
                    "!list",
                    {
                        author: {
                            bot: false,
                            id: "Tester",
                            username: "Tester",
                        },
                    },
                )
                const {includes} = testHelpers

                await (
                    listCmd instanceof Function ? listCmd : listCmd.default
                )(listMsg) // Weird esmodules bug

                includes(listMsg.newMessage.content, "**1**")
                includes(listMsg.newMessage.content, "user2")
                includes(listMsg.newMessage.content, "**2**")
                includes(listMsg.newMessage.content, "user3")
            })
        })

        it("Should not kill the timer if unauthorized", async () => {
            const message2 = new Message(
                `!kill ${id}`,
                {
                    author: {
                        bot: false,
                        id: "user2",
                    },
                },
                new Member("user2", []),
            )

            await handleMessage.default(message2)

            const returnMsg2 = message2.newMessage.content

            testHelpers.includes(returnMsg2, "not authorized")
        })

        it("Should kill the timer properly if authorized", (done) => {
            setTimeout(async () => {
                const message2 = new Message(
                    `!kill ${id}`,
                    {
                        author: {
                            bot: false,
                            id: "user1",
                        },
                    },
                    new Member("user1", []),
                )

                await handleMessage.default(message2)

                const returnMsg2 = message.newMessage.content

                testHelpers.includes(returnMsg2, "Killed timer")

                done()
            }, 100)
        })
    })

    context("Edge cases for the kill command", () => {
        it("Should send message if id is not provided", async () => {
            const message = new Message("!kill")

            await handleMessage.default(message)

            const returnMsg = message.newMessage.content

            testHelpers.includes(returnMsg, "no timers")
        })

        it("Should send message if id is not number", () => {
            const message = new Message("!kill notanumber")

            handleMessage.default(message)

            const returnMsg = message.newMessage.content

            testHelpers.includes(returnMsg, "Learn to count")
        })

        it("Should send a message if no timer with id is found", async () => {
            const message = new Message("!kill 420")

            await handleMessage.default(message)

            const returnMsg = message.newMessage.content

            testHelpers.includes(returnMsg, "Could not find timer")
        })
    })

    context("Time change commands", async () => {
        const myTimer = new Message(
            "!start @Tester",
            {
                author: {
                    bot: false,
                    id: "user2",
                    username: "user2",
                },
            },
        )

        await handleMessage.default(myTimer)

        const id = myTimer.newMessage.content.split(" ")[9]

        it("Should move timer forward by 20 seconds", async () => {
            const forwardMsg = new Message(
                `!forward ${id} 20`,
                {
                    author: {
                        bot: false,
                        id: "user2",
                        username: "user2",
                    },
                },
            )

            await handleMessage.default(forwardMsg)

            testHelpers.includes(forwardMsg.newMessage.content, "forward by 20")

            const time = Number(
                myTimer.newMessage.content
                    .replace(/\n/ug, " ")
                    .split(" ")[8]
            )

            if (!(time >= 20 && time <= 30)) {
                throw new Error(`Expected time to be between 20 and 30. Found ${time}`)
            }
        })

        it("Should move timer backward by 10 seconds", async () => {
            const backwardMsg = new Message(
                `!backward ${id} 10`,
                {
                    author: {
                        bot: false,
                        id: "user2",
                        username: "user2",
                    },
                },
            )

            await handleMessage.default(backwardMsg)

            testHelpers.includes(backwardMsg.newMessage.content, "backwards by 10")

            const time = Number(
                myTimer.newMessage.content
                    .replace(/\n/ug, " ")
                    .split(" ")[8]
            )

            if (!(time >= 10 && time <= 20)) {
                throw new Error(`Expected time to be between 10 and 20. Found ${time}`)
            }
        })

        it("Should not move timer back past 0", async () => {
            const backwardMsg = new Message(
                `!backward ${id} 1000`,
                {
                    author: {
                        bot: false,
                        id: "user2",
                        username: "user2",
                    },
                },
            )

            await handleMessage.default(backwardMsg)

            testHelpers.includes(backwardMsg.newMessage.content, "backwards by 1000")

            const time = Number(
                myTimer.newMessage.content
                    .replace(/\n/ug, " ")
                    .split(" ")[8]
            )

            strictEqual(time, 0)
        })
    })
}

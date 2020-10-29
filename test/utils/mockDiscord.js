/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.1.0
 * @license BSD-3-Clause
 */

class Reaction {

    emoji

    message

    constructor (emoji, message) {
        this.emoji = emoji
        this.message = message
    }

    fetch = () => ({
        emoji: {
            name: this.emoji,
        },
        users: {
            cache: this.message.reactedUsers.filter((val) => (
                val[1] === this.emoji ? [val[0]] : false
            )),
        },
    })

}

let messageId = 0

class Message {

    content

    newMessage

    files

    mentions

    id

    reactedUsers = []

    author = {
        bot: false,
        id: "Tester",
    }

    constructor (content, options) {
        this.content = content
        this.files = options ? options.files : undefined
        this.id = messageId

        messageId++

        if (options && options.author) {
            this.author = options.author
        }

        if (content.includes("@")) {
            this.mentions = {
                users: {
                    first: () => ({
                        id: "Tester",
                    }),
                },
            }
        }
    }

    channel = {
        send: (contents, options) => {
            this.newMessage = new Message(contents, options)

            return this.newMessage
        },
    }

    edit = (val) => {
        this.content = val
    }

    react = async (username, emoji, client) => {
        this.reactedUsers.push([username, emoji])

        if (client.functions.messageReactionAdd !== undefined) {
            await client.functions.messageReactionAdd(new Reaction(emoji, this))
        }
    }

}

class Client {

    functions = {}

    on = (key, func) => {
        this.functions[key] = func
    }

}

module.exports = {
    Message,
    Client,
}

/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.3.0
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

    member

    files

    mentions

    id

    reactedUsers = []

    author = {
        bot: false,
        id: "Tester",
        username: "Tester",
    }

    constructor (content, options, member) {
        this.content = content
        this.files = options ? options.files : undefined
        this.id = messageId
        this.member = member

        messageId++

        if (options && options.author !== undefined) {
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

class User {

    id

    constructor (id) {
        this.id = id
    }

}

class Member {

    roles

    user

    constructor (roles, id) {
        this.roles = {
            roles,
            cache: {
                find: (func) => {
                    for (const role of roles) {
                        if (func(role) === true) {
                            return true
                        }
                    }

                    return null
                },
            },
        }
        this.user = new User(id)
    }

}

module.exports = {
    Message,
    Client,
    Member,
    User,
}

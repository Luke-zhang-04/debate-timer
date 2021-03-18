/**
 * Discord Debate Timer
 * @copyright 2020 - 2021 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.7.0
 * @license BSD-3-Clause
 */

import { PermissionOverwrites } from "discord.js"

export class Reaction {

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
            cache: this.message.reactedEmojis.filter((val) => (
                val[1] === this.emoji ? [val[0]] : false
            )),
        },
    })

}

let messageId = 0

export class Message {

    content

    newMessage

    member

    files

    mentions

    id

    reactedEmojis = {}

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

    reactions = {
        // Hacky way of getting around `this` binding to getterw
        getEmojis: () => {
            return this.reactedEmojis
        },

        get cache() {
            return Object.entries(this.getEmojis())
        }
    }

    channel = {
        send: async (contents, options) => {
            this.newMessage = new Message(contents, options)

            return this.newMessage
        },
    }

    edit = (val) => {
        this.content = val
    }

    react = async (username, emoji, emojiId) => {
        if (this.reactedEmojis[emoji]) {
            this.reactedEmojis[emoji].users.cache.push(new User(username))
        } else {
            this.reactedEmojis[emoji] = {
                users: {
                    cache: [new User(username)],
                },
                emoji: {
                    id: emojiId,
                    name: emoji,
                },
            }
        }
    }

}

export class Client {

    functions = {}

    on = (key, func) => {
        this.functions[key] = func
    }

}

export class User {

    id

    constructor (id) {
        this.id = id
    }

}

export class Member {

    roles

    user

    permission

    constructor (id, roles = [], permissions = []) {
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
        this.permissions = permissions
    }

    hasPermission = (permission) => {
        if (typeof permission === "string") {
            permission = [permission]
        }

        return this.permissions.find((val) => permission.includes(val)) !== undefined
    }

}

export default {
    Message,
    Client,
    Member,
    User,
}

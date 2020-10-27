/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.0.0
 * @license MIT
 */

class Message {

    content

    newMessage

    files

    mentions

    author = {
        bot: false,
        id: "Tester",
    }

    constructor (content, options) {
        this.content = content
        this.files = options ? options.files : undefined

        if (options && options.author) {
            this.author = options.author
        }

        if (content.includes("@")) {
            this.mentions = {
                users: {
                    first: () => ({
                        id: "Tester"
                    })
                }
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

}

module.exports = {
    Message,
}

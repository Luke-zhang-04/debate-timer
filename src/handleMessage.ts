/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @license MIT
 */
import Filter from "bad-words"
import type {Message} from "discord.js"
import help from "./commands/help"
import timer from "./commands/timer"


// Swear words filter
const filter = new Filter()

filter.addWords("dipshit", "dumbass")

/**
 * Handle a command (starts with !)
 * @param message - message object
 * @returns void
 */
const handleCmd = (message: Message): void => {
    if (message.content === "!help") {
        message.channel.send(help())
    } else if (message.content === "!bruh") {
        message.channel.send("", {files: ["https://cdn.discordapp.com/icons/761650833741185055/c711044b42aba73a09d276030bb3fd0b.png?size=256"]})
    } else if (message.content === "!epic") {
        message.channel.send("", {files: ["https://cdn.discordapp.com/avatars/769340249397657601/ba51e72419970f646c8d61c6624bc27b.png?size=256"]})
    } else if (message.content.split(" ")[0] === "!start") {
        timer.start(message)
    } else if (message.content.split(" ")[0] === "!kill") {
        timer.kill(message.channel, message.content.split(" ")[1])
    } else {
        message.channel.send(`Sorry, the command \`${message.content.slice(1)}\` is not recognized. Type \`!help\ for help.`)
    }
}

/**
 * Messages go through this
 * @param message - message object
 * @returns void
 */
export default (message: Message): void => {
    try {
        if (!message.author.bot) {
            if (message.content[0] === "!") {
                handleCmd(message)
            } else if (filter.isProfane(message.content)) {
                const number = Math.random()
                const author = message.author.id

                if (number <= 0.7) {
                    message.channel.send(`Hey <@${author}>! That's not very nice!`)
                } else if (number <= 0.8) {
                    message.channel.send(`Does your asshole get jealous of all the shit that comes out of your mouth <@${author}>?1`)
                } else {
                    message.channel.send(`<@${author}>`, {files: ["https://stayhipp.com/wp-content/uploads/2019/02/you-better-watch.jpg"]})
                }
            }
        }
    } catch (err) {
        message.channel.send(`Sorry, this bot has died (crashed) due to an unexpected error ${err}`)
    }
}

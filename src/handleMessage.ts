/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang, Ridwan Alam
 * @author Luke Zhang luke-zhang-04.github.io/
 * @license MIT
 */
import Filter from "bad-words"
import {Message} from "discord.js"
import {client} from "."
import help from "./commands/help"
import motion from "./commands/randomMotion"
import teamGen from "./commands/teamGen"
import timer from "./commands/timer"


// Swear words filter
const filter = new Filter()

filter.addWords("dipshit", "dumbass")

/**
 * Handle a command (starts with !)
 * @param message - message object
 * @returns void
 */
const handleCmd = async (message: Message): Promise<void> => {
    const [cmd] = message.content.slice(1).split(" ")

    switch (cmd) {
        case undefined:
            break
        case "help":
            help(message)
            break
        case "man":
            help(message)
            break
        case "bruh":
            message.channel.send("", {files: ["https://cdn.discordapp.com/icons/761650833741185055/c711044b42aba73a09d276030bb3fd0b.png?size=256"]})
            break
        case "epic":
            message.channel.send("", {files: ["https://cdn.discordapp.com/avatars/769340249397657601/ba51e72419970f646c8d61c6624bc27b.png?size=256"]})
            break
        case "start":
            timer.start(message)
            break
        case "kill":
            timer.kill(message.channel, message.content.split(" ")[1])
            break
        case "makeTeams":
            teamGen.randomTeams(message.channel)
            break
        case "makePartners":
            teamGen.randomPartners(message)
            break
        case "makeRound":
            /* eslint-disable */
            teamGen.randomPartners(message) &&
            teamGen.randomTeams(message.channel)
            /* eslint-disable */
            message.channel.send(await motion.getRandomMotion())

            break
        case "getMotion":
            message.channel.send(await motion.getRandomMotion())
            break
        case "getMotions":
            motion.getRandomMotions(message)
            break
        case "ping":
            message.channel.send(`:ping_pong: Latency is ${Math.round(client.ws.ping)}ms`);
            break
        default:
            message.channel.send(`:confused: The command \`${message.content.slice(1)}\` is not recognized.\nIf this was a typo, learn to type.\nOtherwise, type \`!help\` for help.`)
            break
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
            } else if (filter.isProfane(message.content)) { // Swear word detected
                const number = Math.random()
                const author = message.author.id

                if (number <= 0.6) {
                    message.channel.send(`Hey <@${author}>! That's not very nice!`)
                } else if (number <= 0.7) {
                    message.channel.send(`Does your asshole get jealous of all the shit that comes out of your mouth <@${author}>?`)
                } else if (number <= 0.8) {
                    message.channel.send(`Don't fucking swear <@${author}> :angry:.`)
                } else {
                    message.channel.send(`<@${author}>`, {files: ["https://stayhipp.com/wp-content/uploads/2019/02/you-better-watch.jpg"]})
                }
            }
        }
    } catch (err) {
        console.error(err)
        message.channel.send(`Sorry, this bot has died (crashed) due to an unexpected error ${err}`)
    }
}

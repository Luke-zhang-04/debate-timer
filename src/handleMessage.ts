/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @license MIT
 */
import Filter from "bad-words"
import {Message} from "discord.js"
import {client} from "."
import config from "./getConfig"
import help from "./commands/help"
import motion from "./commands/randomMotion"
import teamGen from "./commands/teamGen"
import timer from "./commands/timer"


// Swear words filter
const filter = new Filter()

filter.addWords("dipshit", "dumbass")

let lastCommand = 0

/**
 * Handle a command (starts with !)
 * @param message - message object
 * @returns void
 */
const handleCmd = async (message: Message): Promise<void> => {
    const {prefix} = config
    const [cmd] = message.content.slice(prefix.length).split(" ")

    switch (cmd) {
        case undefined || "":
            message.channel.send(`:wave: Hey there! Yes, I'm alive. If you need help using me, type \`${prefix}help\`!`)
            break
        case "help" || "man":
            help(message)
            break
        case "bruh":
            message.channel.send("", {files: [config.serverIconUrl]})
            break
        case "coinflip":
            message.channel.send(Math.random() > 0.5 ? ":coin: Heads!" : ":coin: Tails!")
            break
        case "epic":
            message.channel.send("", {files: [config.botIconUrl]})
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
            teamGen.randomTeams(message.channel) &&
            message.channel.send(`:speaking_head: ${await motion.getRandomMotion()}`)
            /* eslint-enable */

            break
        case "getMotion":
            message.channel.send(`:speaking_head: ${await motion.getRandomMotion()}`)
            break
        case "getMotions":
            motion.getRandomMotions(message)
            break
        case "ping":
            message.channel.send(`:ping_pong: Latency is ${Math.round(client.ws.ping)}ms`)
            break
        default:
            message.channel.send(`:confused: The command \`${message.content.slice(prefix.length)}\` is not recognized.\nIf this was a typo, learn to type.\nOtherwise, type \`${prefix}help\` for help.`)
            break
    }
}

/* eslint-disable */
/**
 * Messages go through this
 * @param message - message object
 * @returns void
 */
export default (message: Message): void => {
    if (!message.author.bot) {
        if (message.content.startsWith(config.prefix)) {
            const timeGap = config.commandCooldown * 1000

            if (Date.now() - lastCommand >= timeGap) { // Time gap reached
                handleCmd(message)
                lastCommand = Date.now()

                return
            }

            message.channel.send(`The configured command cooldown is ${config.commandCooldown}s. Since this bot is hosted on either some crappy server or Luke's laptop, there needs to be a cooldown. The cooldown time can be changed in the configuration file.`)
        } else if (
            config.shouldDetectProfanity &&
            filter.isProfane(message.content)
        ) { // Swear word detected
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
}
/* eslint-enable */

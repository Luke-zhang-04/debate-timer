/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.1.1
 * @license BSD-3-Clause
 */

import {Client, Message} from "discord.js"
import Filter from "bad-words"
import config from "./getConfig"
import help from "./commands/help"
import motion from "./commands/randomMotion"
import poll from "./commands/poll"
import systemInfo from "./commands/systemInfo"
import teamGen from "./commands/teamGen"
import timer from "./commands/timer"

interface Commands {
    help: ()=> unknown,
    bruh: ()=> unknown,
    coinflip: ()=> unknown,
    epic: ()=> unknown,
    start: ()=> unknown,
    kill: ()=> unknown,
    makeTeams: ()=> unknown,
    makePartners: ()=> unknown,
    makeRound: ()=> unknown,
    getMotion: ()=> unknown,
    getMotions: ()=> unknown,
    systemInfo: ()=> unknown,
    poll: ()=> unknown,
    getPoll: ()=> unknown,
    pause: ()=> unknown,
    play: ()=> unknown,
}

// Swear words filter
const filter = new Filter()

filter.addWords("dipshit", "dumbass")

let lastCommand = 0

/* eslint max-lines-per-function: ["error", {"max": 50, "skipComments": true, "skipBlankLines": true}] */
/**
 * Handle a command (starts with !)
 * @param message - message object
 * @returns void
 */
const handleCmd = (message: Message, client: Client): void => {
    const {prefix} = config
    const [cmd] = message.content.slice(prefix.length).split(" ")
    const commands: Commands = {
        help: () => help(message),
        bruh: () => message.channel.send("", {files: [config.serverIconUrl]}),
        coinflip: () => message.channel.send(Math.random() > 0.5 ? ":coin: Heads!" : ":coin: Tails!"),
        epic: () => message.channel.send("", {files: [config.botIconUrl]}),
        start: () => timer.start(message),
        kill: () => {
            const shouldmute = message.content.split(" ")[2] === undefined ||
                message.content.split(" ")[2] === "mute"

            timer.kill(message.channel, message.content.split(" ")[1], shouldmute)
        },
        makeTeams: () => teamGen.randomTeams(message.channel),
        makePartners: () => teamGen.randomPartners(message),
        makeRound: async () => {
            /* eslint-disable */
            teamGen.randomPartners(message) &&
            teamGen.randomTeams(message.channel) &&
            message.channel.send(`:speaking_head: ${await motion.getRandomMotion()}`)
            /* eslint-enable */
        },
        getMotion: async () => message.channel.send(`:speaking_head: ${await motion.getRandomMotion()}`),
        getMotions: () => motion.getRandomMotions(message),
        systemInfo: async () => message.channel.send(await systemInfo()),
        poll: () => poll.makePoll(message, client),
        getPoll: () => poll.getPoll(message.channel),
        pause: () => {
            timer.playPause(message.channel, message.content.split(" ")[1], "pause")
        },
        play: () => {
            timer.playPause(message.channel, message.content.split(" ")[1], "play")
        }
    }

    switch (cmd) {
        case undefined || "":
            message.channel.send(`:wave: Hey there! Yes, I'm alive. If you need help using me, type \`${prefix}help\`!`)

            return

        case "man":
            commands.help()

            return

        default: break
    }

    for (const [key, command] of Object.entries(commands)) {
        if (cmd === key) {
            (command as ()=> unknown)()

            return
        }
    }

    message.channel.send(`:confused: The command \`${message.content.slice(prefix.length)}\` is not recognized.\nIf this was a typo, learn to type.\nOtherwise, type \`${prefix}help\` for help.`)
}

/* eslint-disable */
/**
 * Messages go through this
 * @param message - message object
 * @returns void
 */
export default (message: Message, client: Client): void => {
    if (!message.author.bot) {
        if (message.content.startsWith(config.prefix)) {
            const timeGap = config.commandCooldown * 1000

            if (
                process.env.NODE_ENV === "test" ||
                Date.now() - lastCommand >= timeGap
            ) { // Time gap reached
                handleCmd(message, client)
                lastCommand = Date.now()

                return
            }

            message.channel.send(`The configured command cooldown is ${config.commandCooldown}s. Since this bot is hosted on either some crappy server or Luke's laptop, there needs to be a cooldown. The cooldown time can be changed in the configuration file.`)
        } else if (
            config.shoulddetectProfanity &&
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

/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.5.0
 * @license BSD-3-Clause
 */

import {Client, Message} from "discord.js"
import Filter from "bad-words"
import changeTime from "./commands/timer/changeTime"
import config from "./getConfig"
import didyoumean from "didyoumean"
import help from "./commands/help"
import kill from "./commands/timer/kill"
import list from "./commands/list"
import motion from "./commands/randomMotion"
import playPause from "./commands/timer/playPause"
import poll from "./commands/poll"
import start from "./commands/timer"
import systemInfo from "./commands/systemInfo"
import teamGen from "./commands/teamGen"

type Commands = {[key: string]: (()=> unknown)}

// Swear words filter
const filter = new Filter()

filter.addWords("dipshit", "dumbass")
filter.removeWords(...config.whitelistedWords)

didyoumean.threshold = 0.6

let lastCommand = 0

const timer = Object.freeze({
    changeTime,
    kill,
    playPause,
    start,
})

/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * All commands
 * @param message - message object
 * @param client - client object
 * @returns void
 */
const getCommands = (message: Message, client: Client): Commands => ({
    help: () => help(message),
    man: () => help(message),
    bruh: () => message.channel.send("", {files: [config.serverIconUrl]}),
    coinflip: () => message.channel.send(Math.random() > 0.5 ? ":coin: Heads!" : ":coin: Tails!"),
    epic: () => message.channel.send("", {files: [config.botIconUrl]}),
    start: () => timer.start(message),
    kill: () => {
        const shouldMute = message.content.split(" ")[2] === undefined ||
            message.content.split(" ")[2] === "mute"

        return timer.kill(
            message, message.content.split(" ")[1], shouldMute,
        )
    },
    list: () => list(message),
    take: () => changeTime(message, 1),
    give: () => changeTime(message, -1),
    forward: () => changeTime(message, 1),
    backward: () => changeTime(message, -1),
    makeDraw: () => teamGen.makeDraw(message),
    draw: () => teamGen.makeDraw(message),
    makeTeams: () => teamGen.makeTeams(message),
    teams: () => teamGen.makeTeams(message),
    makePartners: () => teamGen.makePartners(message),
    partners: () => teamGen.makePartners(message),
    makeRound: () => teamGen.makeRound(message),
    round: () => teamGen.makeRound(message),
    getMotion: async () => message.channel.send(`:speaking_head: ${await motion.getRandomMotion()}`),
    motion: async () => message.channel.send(`:speaking_head: ${await motion.getRandomMotion()}`),
    getMotions: () => motion.getRandomMotions(message),
    motions: () => motion.getRandomMotions(message),
    systemInfo: async () => message.channel.send(await systemInfo()),
    poll: () => poll.makePoll(message, client),
    getPoll: () => poll.getPoll(message.channel),
    pause: () => {
        timer.playPause(
            message, message.content.split(" ")[1], "pause",
        )
    },
    resume: () => {
        timer.playPause(
            message, message.content.split(" ")[1], "resume",
        )
    },
})
/* eslint-enable @typescript-eslint/explicit-function-return-type */


/**
 * Handle a command (starts with !)
 * @param message - message object
 * @param client - client object
 * @returns unknown
 */
const handleCmd = async (message: Message, client: Client): Promise<void> => {
    // Trip duplicate spaces to just one space
    message.content = message.content.replace(/  +/gui, " ")

    // Bot command prefix
    const {prefix} = config

    // Command name
    const [cmd] = message.content.slice(prefix.length).split(" ")
    const commands = getCommands(message, client)

    switch (cmd) {
        case null || undefined || "":
            message.channel.send(`:wave: Hey there! Yes, I'm alive. If you need help using me, type \`${prefix}help\`!`)

            return

        default: break
    }

    const correctedCmd = config.shouldUseFuzzyStringMatch
        ? didyoumean(cmd, Object.keys(commands))
        : cmd

    // Await in loop is ok because we return after the loop anyways
    /* eslint-disable no-await-in-loop */
    if (correctedCmd !== null) {
        for (const [key, command] of Object.entries(commands)) {
            if (correctedCmd === key) {
                if (correctedCmd !== cmd) {
                    const shouldTypo = process.env.NODE_ENV !== "test" && Math.random() > 0.75
                    const content = `Automatically corrected your input from \`${cmd}\` to \`${correctedCmd}\`. Learn to ${shouldTypo ? "tpye" : "type"}.`

                    message.channel.send(content).then((_message) => {
                        if (shouldTypo) {
                            setTimeout(() => {
                                _message.edit(`${content.replace(/tpe|tpye/gu, "type")}`)
                            }, 2500)
                        }
                    })
                }

                await command()

                return
            }
        }
    }
    /* eslint-enable no-await-in-loop */

    const shouldTypo = process.env.NODE_ENV !== "test" && Math.random() > 0.75
    const content = `:confused: The command \`${message.content.slice(prefix.length)}\` is not recognized.\nIf this was a typo, learn to ${shouldTypo ? "tpe" : "type"}.\nOtherwise, ${shouldTypo ? "tpye" : "type"} \`${prefix}help\` for help.`

    message.channel.send(content).then((_message) => {
        if (shouldTypo) {
            setTimeout(() => {
                _message.edit(`${content.replace(/tpe|tpye/gu, "type")}`)
            }, 2500)
        }
    })
}

/* eslint-disable */
/**
 * Messages go through this
 * @param message - message object
 * @returns void
 */
export default async (message: Message, client: Client): Promise<void> => {
    if (!message.author.bot) {
        if (message.content.startsWith(config.prefix)) {
            const timeGap = config.commandCooldown * 1000

            if (
                process.env.NODE_ENV === "test" ||
                Date.now() - lastCommand >= timeGap
            ) { // Time gap reached
                await handleCmd(message, client)
                lastCommand = Date.now()

                return
            }

            message.channel.send(`The configured command cooldown is ${config.commandCooldown}s. Since this bot is hosted on either some crappy server or Luke's laptop, there needs to be a cooldown. The cooldown time can be changed in the configuration file.`)
        } else if (
            config.shouldDetectProfanity &&
            filter.isProfane(message.content)
        ) { // Swear word detected
            const number = Math.random(),
                author = message.author.id

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

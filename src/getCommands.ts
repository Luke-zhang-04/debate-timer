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

type Commands = {[key: string]: ((message: Message, client: Client)=> unknown)}

// Swear words filter
const filter = new Filter()

filter.addWords(...config.blacklistedWords)
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
const commands: Commands = {
    help,
    man: help,
    bruh: (message) => message.channel.send("", {files: [config.serverIconUrl]}),
    coinflip: (message) => message.channel.send(Math.random() > 0.5 ? ":coin: Heads!" : ":coin: Tails!"),
    epic: (message) => message.channel.send("", {files: [config.botIconUrl]}),
    start: timer.start,
    kill: timer.kill,
    stop: timer.kill,
    list,
    take: (message) => changeTime(message, 1),
    give: (message) => changeTime(message, -1),
    forward: (message) => changeTime(message, 1),
    backward: (message) => changeTime(message, -1),
    makeDraw: teamGen.makeDraw,
    draw: teamGen.makeDraw,
    makeTeams: teamGen.makeTeams,
    teams: teamGen.makeTeams,
    makePartners: teamGen.makePartners,
    partners: teamGen.makePartners,
    makeRound: teamGen.makeRound,
    round: teamGen.makeRound,
    getMotion: motion.sendRandomMotion,
    motion: motion.sendRandomMotion,
    getMotions: motion.getRandomMotions,
    motions: motion.getRandomMotions,
    systemInfo: async (message) => message.channel.send(await systemInfo()),
    poll: poll.makePoll,
    getPoll: poll.getPoll,
    pause: (message) => {
        timer.playPause(
            message, message.content.split(" ")[1], "pause",
        )
    },
    resume: (message) => {
        timer.playPause(
            message, message.content.split(" ")[1], "resume",
        )
    },
}
/* eslint-enable @typescript-eslint/explicit-function-return-type */

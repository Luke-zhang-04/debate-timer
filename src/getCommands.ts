/**
 * Discord Debate Timer
 *
 * @license BSD-3-Clause
 * @version 1.9.1
 * @author Luke Zhang luke-zhang-04.github.io/
 * @copyright 2020 - 2021 Luke Zhang
 */

import * as timer from "./commands/timer"
import {Client, Message} from "discord.js"
import {randint, shuffleReturn as shuffle} from "./utils"
import broadcast from "./commands/broadcast"
import changeTime from "./commands/timer/changeTime"
import changelog from "./commands/changelog"
import config from "./getConfig"
import help from "./commands/help"
import motion from "./commands/randomMotion"
import poll from "./commands/poll"
import systemInfo from "./commands/systemInfo"
import teamGen from "./commands/teamGen"

type Commands = Readonly<{[key: string]: (message: Message, client: Client) => unknown}>

/* eslint-disable @typescript-eslint/explicit-function-return-type */

/**
 * Commands which use are written inline and don't require much code
 */
const microCommands: Commands = {
    bruh: (message) => message.channel.send("", {files: [config.serverIconUrl]}),
    based: (message) => message.channel.send("", {files: [config.otherImageUrl]}),
    coinflip: (message) =>
        message.channel.send(Math.random() > 0.5 ? ":coin: Heads!" : ":coin: Tails!"),
    epic: (message) => message.channel.send("", {files: [config.botIconUrl]}),
    dice: (message) => message.channel.send(`:game_die: ${randint(1, 7)}`),
    ping: (message, client) =>
        message.channel.send(`:ping_pong: Latency is ${Math.round(client.ws.ping)}ms`),
    systemInfo: async (message) => message.channel.send(await systemInfo()),
    shuffle: (message) =>
        message.channel.send(shuffle(message.content.split(" ").slice(1), 3).join(" ")),
}

/**
 * Timer related commands
 */
const timerCommands: Commands = {
    start: timer.start,
    timer: timer.start,
    kill: timer.kill,
    stop: timer.kill,
    end: timer.kill,
    list: timer.list,
    take: (message) => changeTime(message, 1),
    give: (message) => changeTime(message, -1),
    forward: (message) => changeTime(message, 1),
    backward: (message) => changeTime(message, -1),
    back: (message) => changeTime(message, -1),
    pause: timer.pause,
    resume: timer.resume,
}

/**
 * Team generation related commands
 */
const teamGenCommands: Commands = {
    makeDraw: teamGen.makeDraw,
    draw: teamGen.makeDraw,
    makeTeams: teamGen.makeTeams,
    teams: teamGen.makeTeams,
    makePartners: teamGen.makePartners,
    partners: teamGen.makePartners,
    makeRound: teamGen.makeRound,
    round: teamGen.makeRound,
    newMotion: teamGen.newMotion,
}

/**
 * Motion related commands
 */
const motionCommands: Commands = {
    getMotion: motion.sendRandomMotion,
    motion: motion.sendRandomMotion,
    getMotions: motion.getRandomMotions,
    motions: motion.getRandomMotions,
}

/**
 * Poll related commands
 */
const pollCommands: Commands = {
    poll: poll.makePoll,
    getPoll: poll.getPoll,
}

const miscCommands: Commands = {
    broadcast,
    changelog,
}

/**
 * All commands
 *
 * @param message - Message object
 * @param client - Client object
 * @returns Void
 */
export const commands: Readonly<Commands> = {
    help,
    man: help,
    ...microCommands,
    ...miscCommands,
    ...timerCommands,
    ...teamGenCommands,
    ...motionCommands,
    ...pollCommands,
}
/* eslint-enable @typescript-eslint/explicit-function-return-type */

export default commands

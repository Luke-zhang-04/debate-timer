/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.6.1
 * @license BSD-3-Clause
 */

import * as timer from "./commands/timer"
import {Client, Message} from "discord.js"
import changeTime from "./commands/timer/changeTime"
import config from "./getConfig"
import help from "./commands/help"
import list from "./commands/list"
import motion from "./commands/randomMotion"
import poll from "./commands/poll"
import {randint} from "./utils"
import systemInfo from "./commands/systemInfo"
import teamGen from "./commands/teamGen"

type Commands = {[key: string]: ((message: Message, client: Client)=> unknown)}

/* eslint-disable @typescript-eslint/explicit-function-return-type */

/**
 * All commands
 * @param message - message object
 * @param client - client object
 * @returns void
 */
export const commands: Commands = {
    help,
    man: help,
    bruh: (message) => message.channel.send("", {files: [config.serverIconUrl]}),
    coinflip: (message) => message.channel.send(Math.random() > 0.5 ? ":coin: Heads!" : ":coin: Tails!"),
    epic: (message) => message.channel.send("", {files: [config.botIconUrl]}),
    dice: (message) => message.channel.send(`:game_die: ${randint(1, 7)}`),
    start: timer.start,
    timer: timer.start,
    kill: timer.kill,
    stop: timer.kill,
    list,
    take: (message) => changeTime(message, 1),
    give: (message) => changeTime(message, -1),
    forward: (message) => changeTime(message, 1),
    backward: (message) => changeTime(message, -1),
    back: (message) => changeTime(message, -1),
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
    pause: timer.pause,
    resume: timer.resume,
}
/* eslint-enable @typescript-eslint/explicit-function-return-type */

export default commands

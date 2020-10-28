/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.0.0
 * @license BSD-3-Clause
 */

import type {Message} from "discord.js"
import fs from "fs"
import {prefix} from "../getConfig"

// Object with all the manual entries
const manual: {[key: string]: string} = {
    bruh: `> **\`${prefix}bruh\`**
> Otis.`,
    coinflip: `> **\`${prefix}coinflip\`**
> Flip a coin`,
    epic: `> **\`${prefix}epic\`**
> Shen Bapiro.`,
    start: `> **\`${prefix}start [@mention?]\`**
> Starts a 5 minute timer with 30 seconds protected time at the start and end.
> Parameters:
>     \`[@mention?]\` - optional - @mention for current speaker
> Will ping \`[@mention]\` for important times if included
> Will also mute \`[@mention]\` after 5:15
> E.g \`${prefix}start @debate-timer\``,
    kill: `> **\`${prefix}kill [id] [shouldMute? = noMute | mute | undefined]\`**
> Kills a timer with id of \`[id]\`
> Parameters:
>     \`[id]\` - required - integer value for timer id. Should be displayed under a timer.
>     \`[shouldMute?]\` - optional - you can skip this parameter or pass in "mute" to mute the user after their speech, or pass in "noMute" to make sure the user doesn't get muted after killin the timer.
> E.g \`${prefix}kill 254\``,
    getMotion: `> **\`getMotion\`**
> Gets a random motion from the hellomotions spreadsheet
> <https://docs.google.com/spreadsheets/d/1qQlqFeJ3iYbzXYrLBMgbmT6LcJLj6JcG3LJyZSbkAJY/edit?usp=sharing>`,
    getMotions: `> **\`getMotions [count?]\`**
> Gets multiple motions from the hellomotions spreadsheet
> <https://docs.google.com/spreadsheets/d/1qQlqFeJ3iYbzXYrLBMgbmT6LcJLj6JcG3LJyZSbkAJY/edit?usp=sharing>
> Parameters:
>     \`[count?]\` - optional - integer value for number of motions to get. Default is 5. Won't do more than 20.
> E.g \`${prefix}getMotions 6\``,
    makeTeams: `> **\`${prefix}makeTeams\`**
> Makes random teams with \`Team A\` \`Team B\` \`Team C\` and \`Team D\``,
    makePartners: `> **\`${prefix}makePartners [debater1] [debater2] ... [debater8]\`**
> Makes random partners
> Parameters:
>      \`[debater1]\` - required - @mention of debater 1
>      \`[debater2]\` - required - @mention of debater 2
>      ...
>      \`[debater8]\` - required - @mention of debater 8
> A total of 8 debaters are required
> E.g \`${prefix}makePartners @debate-timer debater2 debater3 debater4 debater5 debater6 debater7 debater8\``,
    makeRound: `> **\`${prefix}makeRound [debater1] [debater2] ... [debater8]\`**
> Creates random teams, random partners, and chooses a random motion
> Similar to \`makePartners\`, 8 debater names are required.`,
}

const {version} = JSON.parse(fs.readFileSync("package.json").toString())

// Default help message
const defaultMsg = `**Debate Timer Bot**

This project is open source.
You can contribute to it at <https://github.com/Luke-zhang-04/debate-timer>
For a web timer, you can go to <https://luke-zhang-04.github.io/debate-timer/>.

The configured prefix is \`${prefix}\`
This bot is in version ${version}

> :book: **\`${prefix}help [command?]\`**
> Get some help
> Parameters:
>     [command?] - optional - name of command to get more detailed help with. Doesn't have to include \`${prefix}\`.
> E.g ${prefix}help getMotion
> E.g ${prefix}man ${prefix}start

> :book: **\`${prefix}man [command?]\`**
> Stands for manual
> Functionally equivalent to \`help\`

**Commands:**
> **\`${prefix}bruh\`**
> **\`${prefix}coinfilp\`**
> **\`${prefix}epic\`**

> :computer:
> **\`ping\`**
> **\`systemInfo\`**

> :timer:
> **\`${prefix}start [@mention?]\`**
> **\`${prefix}kill [id] [shouldMute?]\`**

> :newspaper:
> **\`${prefix}getMotion\`**
> **\`${prefix}getMotions [count?]\`**

> :speaking_head:
> **\`${prefix}makeTeams\`**
> **\`${prefix}makePartners [debater1] [debater2] ... [debater8]\`**
> **\`${prefix}makeRound\`**
`

/**
 * Help command invoked with !help
 * @returns string
 */
export default (message: Message) => {
    const arg = message.content.split(" ")[1]

    if (arg === undefined) {
        message.channel.send(defaultMsg)
    } else if (arg in manual) {
        message.channel.send(`:book: **Debate Timer Bot**\n${manual[arg]}`)
    } else if (arg.slice(1) in manual) {
        message.channel.send(`:book: **Debate Timer Bot**\n${manual[arg.slice(1)]}`)
    } else {
        message.channel.send(`:book: No manual entry for ${arg}`)
    }
}

/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.5.0
 * @license BSD-3-Clause
 */
import {prefix, shouldUseFuzzyStringMatch} from "../getConfig"
import type {Message} from "discord.js"
import didyoumean from "didyoumean"
import fs from "fs"

/* eslint-disable no-sync */

// Object with all the mafullConfignual entries
const manual: {[key: string]: string} = {
    bruh: `>>> **\`${prefix}bruh\`**
B R U H.`,

    coinflip: `>>> **\`${prefix}coinflip\`**
Flip a coin`,

    epic: `>>> **\`${prefix}epic\`**
Ok, this is epic.`,

    start: `>>> **\`${prefix}start [@mention?] [timeControl?: 3 | 5 | 7 = 5]\`**
Starts a timer with a default length of 5 minutes.
If the speech is 5 or 7 minutes, there is 30 seconds protected time at the start and end of the speech.
All lengths include 15 seconds grace time.
Parameters:
    \`[@mention?]\` - optional - @mention for current speaker
    \`[timeControl?: 3 | 5 | 7 = 5]\` - optional - speech length in minutes, must be 3, 5, or 7. Default value of 5.
Note that parameter order does not matter :smiley:
Will ping \`[@mention]\` for important times if included
Will also mute \`[@mention]\` after 5:15
E.g \`${prefix}start @debate-timer\``,

    kill: `>>> **\`${prefix}kill [id] [shouldMute?: noMute | mute | undefined]\`**
Kills a timer with id of \`[id]\`
Parameters:
    \`[id]\` - required - integer value for timer id. Should be displayed under a timer.
    \`[shouldMute?]\` - optional - you can skip this parameter or pass in "mute" to mute the user after their speech, or pass in "noMute" to make sure the user doesn't get muted after killin the timer.
E.g \`${prefix}kill 254\``,

    list: `>>> **\`list [global?: global | undefined]\`**
Lists the currently stored timers
Parameters:
    \`[global?]\` - optional - if "global" is passed in, it will display all timers regardless of ownership. Otherwise, it will show all the timers that you were tagged with, or you created.
E.g \`${prefix}list global\``,

    give: `>>> ** \`give [id] [amt]\`**
Gives \`[amt]\` amount of seconds to timer with id \`[id]\`
Parameters:
   \`[id]\` - required - integer value for timer id. Should be displayed under a timer.
   \`[amt]\` - required - amount in seconds to wind the timer back
E.g \`${prefix}give 0 10\``,

    take: `>>> ** \`take [id] [amt]\`**
Takes \`[amt]\` amount of seconds from timer with id \`[id]\`
Parameters:
   \`[id]\` - required - integer value for timer id. Should be displayed under a timer.
   \`[amt]\` - required - amount in seconds to wind the timer forward
E.g \`${prefix}take 0 10\``,

    backward: `>>> ** \`backward [id] [amt]\`**
Functionally equivalent to \`give\`
Winds timer with id \`[id]\` backward by \`[amt]\`
Parameters:
   \`[id]\` - required - integer value for timer id. Should be displayed under a timer.
   \`[amt]\` - required - amount in seconds to wind the timer back`,

    forward: `>>> ** \`take [id] [amt]\`**
Functionally equivalent to \`take\`
Winds timer with id \`[id]\` forward by \`[amt]\`
Parameters:
   \`[id]\` - required - integer value for timer id. Should be displayed under a timer.
   \`[amt]\` - required - amount in seconds to wind the timer forward`,

    getMotion: `>>> **\`getMotion\`**
Gets a random motion from the hellomotions spreadsheet
<https://docs.google.com/spreadsheets/d/1qQlqFeJ3iYbzXYrLBMgbmT6LcJLj6JcG3LJyZSbkAJY/edit?usp=sharing>`,

    getMotions: `>>> **\`getMotions [count?]\`**
Gets multiple motions from the hellomotions spreadsheet
<https://docs.google.com/spreadsheets/d/1qQlqFeJ3iYbzXYrLBMgbmT6LcJLj6JcG3LJyZSbkAJY/edit?usp=sharing>
Parameters:
    \`[count?]\` - optional - integer value for number of motions to get. Default is 5. Won't do more than 20.
E.g \`${prefix}getMotions 6\``,

    makeTeams: `>>> **\`${prefix}makeTeams [format?: bp | cp | worlds = bp]\`**
Makes random teams with \`Team A\` \`Team B\` \`Team C\` and \`Team D\`
Parameters:
    \`[format?: bp | cp | worlds = bp]\` - optional - the debate format to make teams for. Default value of bp.
E.g \`${prefix}\`makeTeams bp`,

    makePartners: `>>> **\`${prefix}makePartners [format?: bp | cp | worlds = bp] [debater1] [debater2] ...\`**
Makes random partners
Parameters:
    \`[format?: bp | cp | worlds = bp]\` - optional - the debate format to make teams for. Default value of bp.
    \`[debater1]\` - required - @mention of debater 1
    \`[debater2]\` - required - @mention of debater 2
    ...
The number of required debaters is dependent on the format of choice. Adding extra debaters will result in randomly excluded debaters.
E.g \`${prefix}makePartners @debate-timer debater2 debater3 debater4 debater5 debater6 debater7 debater8 debater9 bp\``,

    makeRound: `>>> **\`${prefix}makeRound \`[format?: bp | cp | worlds = bp]\` - optional [debater1] [debater2]\`**
Creates random draw, and chooses a random motion
Similar to \`makeDraw\`.`,

    makeDraw: `>>> **\`${prefix}makeDraw [format?: bp | cp | worlds = bp] [debater1] [debater2] ...\`**
Makes random draw, which includes positions and teams.
Parameters:
    \`[format?: bp | cp | worlds = bp]\` - optional - the debate format to make teams for. Default value of bp.
    \`[debater1]\` - required - @mention of debater 1
    \`[debater2]\` - required - @mention of debater 2
    ...
The number of required debaters is dependent on the format of choice. Adding extra debaters will result in randomly excluded debaters.
E.g \`${prefix}makePartners @debate-timer debater2 debater3 debater4 debater5 debater6 debater7 debater8 debater9 bp\``,

    poll: `>>> **\`${prefix}poll\`**
Creates a poll for debating and spectating
Only one poll can run at a time
Creating a new poll will erase the data in any other polls`,

    getPoll: `>>> **\`${prefix}getPoll\`**
Gets data from current poll. If no poll has been made, data will be empty.`,

    resume: `>>> **\`${prefix}resume [id]\`**
Continues a timer with id of \`[id]\`
Parameters:
    \`[id]\` - required - integer value for timer id. Should be displayed under a timer.
E.g \`${prefix}resume 254\``,

    pause: `>>> **\`${prefix}pause [id]\`**
Pauses a timer with id of \`[id]\`
Parameters:
    \`[id]\` - required - integer value for timer id. Should be displayed under a timer.
E.g \`${prefix}pause 254\``,
}

type Package = {
    name?: string,
    version?: string,
    description?: string,
    main?: string,
    scripts: {[key: string]: string},
    keywords?: string[],
    author?: string | {name: string, url: string, email?: string},
    license?: string,
    dependencies?: {[key: string]: string},
    devDependencies?: {[key: string]: string},
    engines?: {[key: string]: string},
}

const {version} = JSON.parse(fs.readFileSync("package.json").toString()) as Package

// Default help message
const defaultMsg = `**Debate Timer Bot**

This project is open source.
You can contribute to it at <https://github.com/Luke-zhang-04/debate-timer>
Found a bug? Report it at <https://github.com/Luke-zhang-04/debate-timer/issues/new>

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
> **\`${prefix}ping\`**
> **\`${prefix}systemInfo\`**

> :timer:
> **\`${prefix}start [@mention?] [timeControl?: 3 | 5 | 7 = 5]\`**
> **\`${prefix}kill [id] [shouldMute?]\`**
> **\`${prefix}resume [id]\`**
> **\`${prefix}pause [id]\`**
> **\`${prefix}list [global?]\`**
>${" "}
> **\`${prefix}backward [id] [amt]\`**
> **\`${prefix}forward [id] [amt]\`**

> :newspaper:
> **\`${prefix}getMotion\`**
> **\`${prefix}getMotions [count?]\`**

> :speaking_head:
> **\`${prefix}makeTeams [format?: bp | cp | worlds = bp]\`**
> **\`${prefix}makePartners [format?: bp | cp | worlds = bp] [debater1] [debater2] ...\`**
> **\`${prefix}makeDraw [format?: bp | cp | worlds = bp] [debater1] [debater2] ...\`**
> **\`${prefix}makeRound [format?: bp | cp | worlds = bp] [debater1] [debater2] ...\`**
`

/**
 * Help command invoked with !help
 * @param message - Discord message
 * @returns string
 */
export default (message: Message): void => {
    let arg = message.content.split(" ")[1]

    if (arg === undefined) {
        message.channel.send(defaultMsg)

        return
    }

    if (arg[0] === "!") { // Get rid of ! at beginning
        arg = arg.slice(1)
    }

    const correctedArg = shouldUseFuzzyStringMatch
        ? didyoumean(arg, Object.keys(manual))
        : arg

    if (correctedArg === null) {
        message.channel.send(`:book: No manual entry for ${arg}`)

        return
    }

    if (correctedArg !== arg) {
        const shouldTypo = process.env.NODE_ENV !== "test" && Math.random() > 0.75
        const content = `Automatically corrected your entry request from \`${arg}\` to \`${correctedArg}\`. Learn to ${shouldTypo ? "tpe" : "type"}.`

        message.channel.send(content).then((_message) => {
            if (shouldTypo) {
                setTimeout(() => {
                    _message.edit(`${content.replace(/tpe|tpye/gu, "type")}`)
                }, 2500)
            }
        })
    }

    message.channel.send(`:book: **Debate Timer Bot**\n${manual[correctedArg as string]}`)
}

/**
 * Discord Debate Timer
 *
 * @license BSD-3-Clause
 * @version 1.9.3
 * @author Luke Zhang luke-zhang-04.github.io/
 * @copyright 2020 - 2021 Luke Zhang
 */

/* eslint-disable max-lines */
// No, I don't like this file either

import {
    botIconUrl,
    maxMotions,
    prefix,
    shouldAllowJokes,
    shouldUseFuzzyStringMatch,
} from "../getConfig"
import {MessageEmbed} from "discord.js"
import MockMessageEmbed from "../testUtils/mockMessageEmbed"
import didyoumean from "didyoumean"
import fs from "fs"

type Package = {
    name?: string
    version?: string
    description?: string
    main?: string
    scripts: {[key: string]: string}
    keywords?: string[]
    author?: string | {name: string; url: string; email?: string}
    license?: string
    dependencies?: {[key: string]: string}
    devDependencies?: {[key: string]: string}
    engines?: {[key: string]: string}
}

const {version} = JSON.parse(fs.readFileSync("package.json").toString()) as Package

const makeMessageEmbed = (): MessageEmbed | MockMessageEmbed =>
    (process.env.NODE_ENV === "test" ? new MockMessageEmbed() : new MessageEmbed())
        .setColor("#f4f4f4")
        .setAuthor("Debate Timer", botIconUrl, "https://github.com/Luke-zhang-04/debate-timer")
        .setFooter("Copyright (C) 2020 - 2021 Luke Zhang")

/* eslint-disable no-sync */

type Manual = {
    [key: string]: {
        name: string
        value: string
        fields?: {
            name: string
            value: string
        }[]
    }
}

// Object with all the mafullConfignual entries
const manual: Manual = {
    bruh: {
        name: `\`${prefix}bruh\``,
        value: shouldAllowJokes ? "B R U H" : "This command is not enabled",
    },

    coinflip: {
        name: `\`${prefix}coinflip\``,
        value: "Flip a coin",
    },

    based: {
        name: `\`${prefix}based\``,
        value: shouldAllowJokes ? "No comment." : "This command is not enabled",
    },

    epic: {
        name: `\`${prefix}epic\``,
        value: shouldAllowJokes ? "Ok, this is epic." : "This command is not enabled",
    },

    dice: {
        name: `\`${prefix}dice\``,
        value: "Roll a dice",
    },

    regex: {
        name: "Regular Expression Help",
        value: `Basic intro to regular expressions. Find out more here: <https://developer.mozilla.org/docs/Web/JavaScript/Guide/Regular_Expressions/Cheatsheet>.
You can use regex to match most text channel names. For an example, you can match all chats names \`poi\` with \`poi\`.
But you can do more with regex.
- If you have rooms names \`poi-1\`, \`poi-2\`, etc. you can match them with \`poi-.*\`. The \`.*\` will match anything after \`poi-\`.
- You can also use \`poi-[0-9]+\` to match \`poi-\` then one or more of any number.
- If you want to match \`poi\` and \`the-ga\`, you can do \`poi|the-ga\`, or \`poi-.*|the-ga\`.`,
    },

    start: {
        name: `\`${prefix}start [@mention?] [timeControl? = 5] [protectedTime? = auto]\``,
        value: `Starts a timer with a default length of 5 minutes.
        If the speech is 5 minutes, there is 30 seconds protected time at the start and end of the speech. If the speech if 7 or 8 minutes, there is a minute of proteced time.
        All lengths include 15 seconds grace time.`,
        fields: [
            {
                name: "Parameters",
                value: `- \`[@mention?]\` - optional - @mention for current speaker
- \`[timeControl? = 5]\` - optional - speech length in minutes. Default value of 5.
- \`[protectedTime? = auto] - optional - protected time in minutes. Automatically determined by default.\``,
            },
            {
                name: "Notes",
                value: `- Parameter order does not matter :smiley:
- Will ping \`[@mention]\` for important times if included`,
            },
            {
                name: "Usage",
                value: `\`\`\`${prefix}start @debate-timer
${prefix}start 7 0.5
${prefix}start 3 @debate-timer\`\`\``,
            },
        ],
    },

    timer: {
        name: `\`${prefix}timer [@mention?] [timeControl? = 5]\``,
        value: `Functionally equivalent to \`${prefix}start\`.`,
    },

    kill: {
        name: `\`${prefix}kill [id]\``,
        value: "Stops a timer with id of `[id]`",
        fields: [
            {
                name: "Parameters",
                value:
                    "`[id]` - required - integer value for timer id. Will be displayed under a timer.",
            },
            {
                name: "Usage",
                value: `\`${prefix}kill 3\``,
            },
        ],
    },

    stop: {
        name: `\`${prefix}stop [id]\``,
        value: `Functionally equivalent to \`${prefix}kill\`.`,
    },

    end: {
        name: `\`${prefix}end [id]\``,
        value: `Functionally equivalent to \`${prefix}kill\`.`,
    },

    list: {
        name: `\`${prefix}list [global?: global | undefined]\``,
        value: "Lists the currently stored timers",
        fields: [
            {
                name: "Parameters",
                value:
                    '- [global?] - optional - if "global" is passed in, it will display all timers regardless of ownership. Otherwise, it will show all the timers that you were tagged with, or you created.',
            },
            {
                name: "Usage",
                value: `\`\`\`${prefix}list
${prefix}list global\`\`\``,
            },
        ],
    },

    backward: {
        name: `\`${prefix}backward [id] [amt]\``,
        value: "Winds timer with id `[id]` back `[amt]` seconds",
        fields: [
            {
                name: "Parameters",
                value: `- \`[id]\` - required - integer value for timer id. Will be displayed under a timer.
- \`[amt]\` - required - amount in seconds to wind the timer back. Can be negative.`,
            },
            {
                name: "Usage",
                value: `\`${prefix}backward 0 10\` winds timer 0 backwards by 10 seconds`,
            },
        ],
    },

    forward: {
        name: `\`${prefix}forward [id] [amt]\``,
        value: "Winds timer with id `[id]` forward `[amt]` seconds",
        fields: [
            {
                name: "Parameters",
                value: `- \`[id]\` - required - integer value for timer id. Will be displayed under a timer.
- \`[amt]\` - required - amount in seconds to wind the timer forward. Can be negative.`,
            },
            {
                name: "Usage",
                value: `\`${prefix}foward 0 10\` winds timer 0 forward by 10 seconds`,
            },
        ],
    },

    give: {
        name: `\`${prefix}give [id] [amt]\``,
        value: `Functionally equivalent to \`${prefix}backward\`.`,
    },

    back: {
        name: `\`${prefix}back [id] [amt]\``,
        value: `Functionally equivalent to \`${prefix}backward\`.`,
    },

    take: {
        name: `\`${prefix}take [id] [amt]\``,
        value: `Functionally equivalent to \`${prefix}forward\`.`,
    },

    getMotion: {
        name: `\`${prefix}getMotion\``,
        value: `Gets a random motion from the hellomotions spreadsheet
<https://docs.google.com/spreadsheets/d/1qQlqFeJ3iYbzXYrLBMgbmT6LcJLj6JcG3LJyZSbkAJY/edit#gid=2007846678>`,
        fields: [
            {
                name: "Usage",
                value: `\`${prefix}getMotion\``,
            },
        ],
    },

    motion: {
        name: `\`${prefix}motion\``,
        value: `Functionally equivalent to \`${prefix}getMotion\`.`,
    },

    getMotions: {
        name: `\`${prefix}getMotions [count? = 5]\``,
        value: `Gets multiple motions from the hellomotions spreadsheet
<https://docs.google.com/spreadsheets/d/1qQlqFeJ3iYbzXYrLBMgbmT6LcJLj6JcG3LJyZSbkAJY/edit#gid=2007846678>`,
        fields: [
            {
                name: "Parameters",
                value: `\`[count? = 5]\` - optional - integer value for number of motions to get. Default is 5. Won't do more than ${maxMotions}.`,
            },
            {
                name: "Usage",
                value: `\`\`\`${prefix}getMotions
${prefix}getMotions 6\`\`\``,
            },
        ],
    },

    motions: {
        name: `\`${prefix}motions [count? = 5]\``,
        value: `Functionally equivalent to \`${prefix}getMotions\`.`,
    },

    makePartners: {
        name: `\`makePartners [format?: bp | cp | worlds = bp] [debater1] [debater2] ...\``,
        value: "Makes random partners",
        fields: [
            {
                name: "Parameters",
                value: `- \`[format?: bp | cp | worlds = bp]\` - optional - the debate format to make teams for. Default value of bp.
- \`[debater1]\` - required - debater 1
- \`[debater2]\` - required - debater 2
...
- \`[debater n]\` - debater *n*. n must be greater than or equal to the number of debaters specified by your chosen format.`,
            },
            {
                name: "Notes",
                value: `- The number of required debaters is dependent on the format of choice. Adding extra debaters will result in randomly excluded debaters.
- Parameter order does not matter :smiley:. However, if you enter "bp", "cp", or "worlds" as the name of a debater, the command will not work.`,
            },
            {
                name: "Usage",
                value: `\`\`\`${prefix}makePartners worlds debater1 debater2 debater3 debater4 debater5 debater6
${prefix}makePartners @debate-timer debater2 debater3 debater4 debater5 debater6 debater7 debater8 debater9 bp\`\`\``,
            },
        ],
    },

    partners: {
        name: `\`${prefix}partners [format?: bp | cp | worlds = bp] [debater1] [debater2] ...\``,
        value: `Functionally equivalent to \`${prefix}makePartners\`.`,
    },

    makeRound: {
        name: `\`${prefix}makeRound [format?: bp | cp | worlds = bp] [debater1] [debater2] ...\``,
        value: `Creates a random draw, and then chooses a random motion. Refer to \`makeDraw\`.`,
    },

    round: {
        name: `\`${prefix}round [format?: bp | cp | worlds = bp] [debater1] [debater2] ...\``,
        value: `Creates a random draw, and then chooses a random motion. Refer to \`makeDraw\`.`,
    },

    makeDraw: {
        name: `\`${prefix}makeDraw [format?: bp | cp | worlds = bp] [debater1] [debater2] ...\``,
        value: "Makes random draw, which includes positions and teams.",
        fields: [
            {
                name: "Parameters",
                value: `- \`[format?: bp | cp | worlds = bp]\` - optional - the debate format to make teams for. Default value of bp.
- \`[debater1]\` - required - debater 1
- \`[debater2]\` - required - debater 2
...
- \`[debater n]\` - debater *n*. n must be greater than or equal to the number of debaters specified by your chosen format.`,
            },
            {
                name: "Notes",
                value: `- The number of required debaters is dependent on the format of choice. Adding extra debaters will result in randomly excluded debaters.
- Parameter order does not matter :smiley:. However, if you enter "bp", "cp", or "worlds" as the name of a debater, the command will not work.`,
            },
            {
                name: "Usage",
                value: `\`\`\`${prefix}makeDraw worlds debater1 debater2 debater3 debater4 debater5 debater6
${prefix}makeDraw @debate-timer debater2 debater3 debater4 debater5 debater6 debater7 debater8 debater9 bp\`\`\``,
            },
        ],
    },

    draw: {
        name: `\`${prefix}draw [format?: bp | cp | worlds = bp] [debater1] [debater2] ...\``,
        value: `Functionally equivalent to \`${prefix}makeDraw\`.`,
    },

    newMotion: {
        name: `\`${prefix}newMotion\``,
        value:
            "Reply to a generated round, and change the motion. Use this if the motion is bad, but you want to keep the teams.",
        fields: [
            {
                name: "Usage",
                value: `\`${prefix}newMotion\``,
            },
        ],
    },

    poll: {
        name: `\`${prefix}poll\``,
        value: "Creates a poll",
        fields: [
            {
                name: "Notes",
                value: `- Only one poll can run at a time per user
- Creating a new poll will erase a user's old poll
- Polls delete themselves after around at least 1 hour of creation`,
            },
            {
                name: "Usage",
                value: `\`${prefix}poll\``,
            },
        ],
    },

    getPoll: {
        name: `\`${prefix}getPoll [option?] [raw?]\``,
        value:
            "Gets data from user's current poll. If `[option]` is specified, it will fetch the poll data for the specific poll option.",
        fields: [
            {
                name: "Parameters",
                value: `- \`[option?]\` - optional - which poll option to get data for. If not provided, all poll data will be shown.
- \`[raw?]\` - optional - if poll data should be plaintext usernames instead of pings`,
            },
            {
                name: "Usage",
                value: `\`\`\`${prefix}getPoll
${prefix}getPoll debating
${prefix}getPoll raw
${prefix}getPoll spectating raw\`\`\``,
            },
        ],
    },

    pause: {
        name: `\`${prefix}pause [id]\``,
        value: "Pauses a timer with id of `[id]`",
        fields: [
            {
                name: "Parameters",
                value:
                    "`[id]` - required - integer value for timer id. Will be displayed under a timer.",
            },
            {
                name: "Usage",
                value: `\`${prefix}pause 3\``,
            },
        ],
    },

    resume: {
        name: `\`${prefix}resume [id]\``,
        value: "Resumes a timer with id of `[id]`",
        fields: [
            {
                name: "Parameters",
                value:
                    "`[id]` - required - integer value for timer id. Will be displayed under a timer.",
            },
            {
                name: "Usage",
                value: `\`${prefix}resume 3\``,
            },
        ],
    },

    broadcast: {
        name: `\`${prefix}broadcast [regex] [amt? = Infinity]\``,
        value:
            "Broadcasts replied message to `[amt]` number of channels which satisfy the regex restraint `[regex]`. You can learn about regex here <https://developer.mozilla.org/docs/Web/JavaScript/Guide/Regular_Expressions/Cheatsheet>.",
        fields: [
            {
                name: "Parameters",
                value: `- \`[regex]\` - required - regex restraint of channel names for bot to send to
- \`[amt? = Infinity]\` - optional - max number of channels to broadcast to. Default Infinity.`,
            },
            {
                name: "Notes",
                value: `- Parameter order does not matter :smiley:
- You must reply to a message, and that message will be broadcasted`,
            },
            {
                name: "Usage",
                value: `\`\`\`${prefix}broadcast round-[0-9]+
${prefix}broadcast 3 .*\`\`\``,
            },
        ],
    },

    shuffle: {
        name: `\`${prefix}shuffle [item1?] [item2?] ...\``,
        value: "Shuffles the items",
        fields: [
            {
                name: "Parameters",
                value: `- \`[item1?]\` - optional - first item to shuffle
- \`[item2?]\` - optional - second item to shuffle
- and so on`,
            },
            {
                name: "Usage",
                value: `\`${prefix}shuffle a b c d e f g\``,
            },
        ],
    },

    changelog: {
        name: `\`${prefix}changelog [version?]\``,
        value:
            "Shows the changelog of this bot. <https://github.com/Luke-zhang-04/debate-timer/blob/master/CHANGELOG.md>",
        fields: [
            {
                name: "Parameters",
                value: `- \`[version?]\` - optional - which changelog version to show.
> - If no input is provided, a help message is shown.
> - If "latest" is provided, the latest version's changelog will be shown.
> - If "versions"
is provided, the changelog's versions will be shown.`,
            },
            {
                name: "Usage",
                value: `\`\`\`${prefix}changelog latest
${prefix}changelog versions
${prefix}changelog ${version}\`\`\``,
            },
        ],
    },
}

const defaultParams = {
    title: "Debate Timer Bot",
    desc: `This project is open source.
You can contribute to it at <https://github.com/Luke-zhang-04/debate-timer>
Found a bug? Report it at <https://github.com/Luke-zhang-04/debate-timer/issues/new>

The configured prefix is \`${prefix}\`
This bot is in version ${version}`,
    fields: [
        {
            name: "Help",
            value: `:book: \`help [command?]\`
Get some help
**Parameters**
- \`[command?]\` - optional - name of command to get more detailed help with. Doesn't have to include \`${prefix}\`.
E.g ${prefix}help getMotion`,
        },
        {
            name: ":computer: Misc",
            value: `${shouldAllowJokes ? "- based, bruh, epic\n" : ""}- coinfilp, dice
- broadcast [regex] [amt? = Infinity]
- shuffle [item1] [item2] ...
- changelog [version?]`,
        },
        {
            name: ":timer: Timer",
            value: `- start [@mention?] [timeControl?] [protectedTime?]
- kill [id]
- resume [id]
- pause [id]
- list [global?]
- backward [id] [amt]
- forward [id] [amt]`,
        },
        {
            name: ":newspaper: Motions",
            value: `- getMotion
- getMotions [count?]`,
        },
        {
            name: ":speaking_head: Team Formation",
            value: `- makeTeams [format?]
- makePartners [format?] [debater1] [debater2] ...
- makeDraw [format?] [debater1] [debater2] ...
- makeRound [format?] [debater1] [debater2] ...
- newMotion`,
        },
    ],
}

const defaultMsg = makeMessageEmbed()
    .setTitle(defaultParams.title)
    .setDescription(defaultParams.desc)
    .addFields(...defaultParams.fields)
    .setURL("https://github.com/Luke-zhang-04/debate-timer")

/**
 * Help command invoked with !help
 *
 * @param message - Discord message
 * @returns String
 */
export default (message: Message): void => {
    let arg = message.content.split(" ")[1]

    if (arg === undefined) {
        message.channel.send(
            defaultMsg instanceof MessageEmbed ? defaultMsg : defaultMsg.toString(),
        )

        return
    }

    if (arg[0] === "!") {
        // Get rid of ! at beginning
        arg = arg.slice(1)
    }

    const correctedArg = shouldUseFuzzyStringMatch
        ? (didyoumean(arg, Object.keys(manual)) as string)
        : arg

    if (correctedArg === null) {
        message.channel.send(`:book: No manual entry for ${arg}`)

        return
    }

    if (correctedArg.toLowerCase() !== arg.toLowerCase()) {
        const shouldTypo = process.env.NODE_ENV !== "test" && Math.random() > 0.75
        const content = `Automatically corrected your entry request from \`${arg}\` to \`${correctedArg}\`. Learn to ${
            shouldTypo ? "tpe" : "type"
        }.`

        message.channel.send(content).then((_message) => {
            if (shouldTypo) {
                setTimeout(() => {
                    _message.edit(`${content.replace(/tpe|tpye/gu, "type")}`)
                }, 2500)
            }
        })
    }

    const manualEntry = manual[correctedArg]
    const helpMsg = makeMessageEmbed()
        .setTitle(manualEntry.name)
        .setDescription(manualEntry.value)
        .addFields(...(manualEntry.fields ?? []))

    message.channel.send(helpMsg instanceof MessageEmbed ? helpMsg : helpMsg.toString())
}

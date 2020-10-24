/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang, Ridwan Alam
 * @author Luke Zhang luke-zhang-04.github.io/
 * @license MIT
 */

import type {Message} from "discord.js"

const manual: {[key: string]: string} = {
    bruh: `> **\`!bruh\`**
> Otis.`,
    epic: `> **\`!epic\`**
> Shen Bapiro.`,
    start: `> **\`!start [@mention?]\`**
> Starts a 5 minute timer with 30 seconds protected time at the start and end.
> Parameters:
>     \`[@mention?]\` - optional - @mention for current speaker
> Will ping \`[@mention]\` for important times if included
> Will also mute \`[@mention]\` after 5:15`,
    kill: `> **\`!kill [id]\`**
> Kills a timer with id of \`[id]\`
> Parameters:
>     \`[id]\` - required - integer value for timer id. Should be displayed under a timer.`,
    makeTeams: `> **\`!makeTeams\`**
> Makes random teams with \`Team A\` \`Team B\` \`Team C\` and \`Team D\``,
    makePartners: `> **\`!makePartners [debater1] [debater2] ... [debater8]\`**
> Makes random partners
> Parameters:
>      \`[debater1]\` - required - @mention of debater 1
>      \`[debater2]\` - required - @mention of debater 2
>      ...
>      \`[debater8]\` - required - @mention of debater 8
> A total of 8 debaters are required`,
    makeRound: `> **\`!makeRound [debater1] [debater2] ... [debater8]\`**
> Functionally equivalent to \`makePartners\`, except it runs \`makeTeams\` after.
> 8 debater @mentions are still required.`
}

const fullMsg = `**Debate Timer Bot**

This project is open source.
You can contribute to it at <https://github.com/Luke-zhang-04/debate-timer>
For a web timer, you can go to <https://luke-zhang-04.github.io/debate-timer/>.

> **\`!help [command?]\`**
> Get some help
> Parameters:
>     [command?] - optional - name of command to get more detailed help with

> **\`!man [command?]\`**
> Functionally equivalent to \`help\`

> **\`!bruh\`**
> **\`!epic\`**
> **\`!start [@mention?]\`**
> **\`!kill [id]\`**
> **\`!makeTeams\`**
> **\`!makePartners [debater1] [debater2] ... [debater8]\`**
> **\`!makeRound\`**
`

/**
 * Help command invoked with !help
 * @returns string
 */
export default (message: Message) => {
    const arg = message.content.split(" ")[1]

    if (arg === undefined) {
        message.channel.send(fullMsg)
    } else if (arg in manual) {
        message.channel.send(`**Debate Timer Bot**\n${manual[arg]}`)
    } else if (arg.slice(1) in manual) {
        message.channel.send(`**Debate Timer Bot**\n${manual[arg.slice(1)]}`)
    } else {
        message.channel.send(`No manual entry for ${arg}`)
    }
}

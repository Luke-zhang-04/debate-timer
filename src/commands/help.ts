/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @license MIT
 */

/**
 * Help command invoked with !help
 * @returns string
 */
export default (): string => `**Debate Timer Bot**

This project is open source. You can contribute at https://github.com/Luke-zhang-04/debate-timer
For just a timer, you can go to https://luke-zhang-04.github.io/debate-timer/.

> **!help**
> Get some help

> **!bruh**
> Otis.

> **!epic**
> Shen Bapiro.

> **!start [@mention?]**
> Starts a 5 minute timer with 30 seconds protected time at the start and end.
> Parameters:
>     [@mention?] - optional - @mention for current speaker
> Will ping [@mention] for important times if included
> Will also mute [@mention] after 5:15

> **!kill [id]**
> Kills a timer with id of [id]
> Parameters:
>     [id] - required - integer value for timer id. Should be displayed under a timer.
`

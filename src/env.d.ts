/**
 * Discord Debate Timer
 *
 * @license BSD-3-Clause
 * @version 1.9.2
 * @author Luke Zhang luke-zhang-04.github.io/
 * @copyright 2020 - 2021 Luke Zhang
 */

declare namespace NodeJS {
    interface ProcessEnv {
        AUTHTOKEN: string // Authentication Token
        APIKEY: string // Google sheets API key
    }
}

type Client = import("discord.js").Client
type DMChannel = import("discord.js").DMChannel
type Guild = import("discord.js").Guild
type GuildMember = import("discord.js").GuildMember
type Message = import("discord.js").Message
type NewsChannel = import("discord.js").NewsChannel
type TextChannel = import("discord.js").TextChannel
type User = import("discord.js").User

type TextableChannel = TextChannel | DMChannel | NewsChannel

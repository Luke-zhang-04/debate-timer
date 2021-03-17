/**
 * Discord Debate Timer
 * @copyright 2020 - 2021 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.6.1
 * @license BSD-3-Clause
 */

import type {GuildMember} from "discord.js"
import {emojify as _emojify} from "node-emoji"

type PermissionString =
    | "CREATE_INSTANT_INVITE"
    | "KICK_MEMBERS"
    | "BAN_MEMBERS"
    | "ADMINISTRATOR"
    | "MANAGE_CHANNELS"
    | "MANAGE_GUILD"
    | "ADD_REACTIONS"
    | "VIEW_AUDIT_LOG"
    | "PRIORITY_SPEAKER"
    | "STREAM"
    | "VIEW_CHANNEL"
    | "SEND_MESSAGES"
    | "SEND_TTS_MESSAGES"
    | "MANAGE_MESSAGES"
    | "EMBED_LINKS"
    | "ATTACH_FILES"
    | "READ_MESSAGE_HISTORY"
    | "MENTION_EVERYONE"
    | "USE_EXTERNAL_EMOJIS"
    | "VIEW_GUILD_INSIGHTS"
    | "CONNECT"
    | "SPEAK"
    | "MUTE_MEMBERS"
    | "DEAFEN_MEMBERS"
    | "MOVE_MEMBERS"
    | "USE_VAD"
    | "CHANGE_NICKNAME"
    | "MANAGE_NICKNAMES"
    | "MANAGE_ROLES"
    | "MANAGE_WEBHOOKS"
    | "MANAGE_EMOJIS"

export const hasAdminPerms = (
    member: GuildMember | null,
    adminRoleName: {
        type: "permission" | "name",
        value: string,
    },
): boolean => {
    if (adminRoleName.type === "permission") {
        return member?.hasPermission(
            adminRoleName.value as PermissionString,
        ) ?? false
    }

    return (member?.roles.cache.find((role) => (
        role.name === adminRoleName.value
    )) ?? null) !== null
}

export const niceTry = <T>(func: ()=> T): T | undefined => {
    try {
        return func()
    } catch (_) {
        return
    }
}

export const inlineTry = <T>(func: ()=> T): T | Error => {
    try {
        return func()
    } catch (err: unknown) {
        return err instanceof Error
            ? err
            : new Error(typeof err === "string" ? err : String(err))
    }
}

export const emojify = (str: string): string => _emojify(
    str.replace(/:judge:/gu, "🧑‍⚖️"),
)

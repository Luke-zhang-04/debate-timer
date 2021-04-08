/**
 * Discord Debate Timer
 * @copyright 2020 - 2021 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.7.0
 * @license BSD-3-Clause
 */

import type {GuildMember} from "discord.js"
import emoji from "node-emoji"

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
        type: "permission" | "name"
        value: string
    },
): boolean => {
    if (adminRoleName.type === "permission") {
        return member?.hasPermission(adminRoleName.value as PermissionString) ?? false
    }

    return (member?.roles.cache.find((role) => role.name === adminRoleName.value) ?? null) !== null
}

export const niceTry = <T>(func: () => T): T | undefined => {
    try {
        return func()
    } catch (_) {
        return
    }
}

export const inlineTry = <T>(func: () => T): T | Error => {
    try {
        return func()
    } catch (err: unknown) {
        return err instanceof Error ? err : new Error(typeof err === "string" ? err : String(err))
    }
}

export const inlineTryPromise = async <T>(func: () => Promise<T>): Promise<T | Error> => {
    try {
        return await func()
    } catch (err: unknown) {
        return err instanceof Error ? err : new Error(typeof err === "string" ? err : String(err))
    }
}

export const emojify = (str: string): string => emoji.emojify(str.replace(/:judge:/gu, "🧑‍⚖️"))

/**
 * Array.filter with size limit
 * @param array - array to filter
 * @param predicate - function to determine if item matches predicate
 * @param maxSize - max number of items in filter
 * @returns generator
 */
export function* filter<T>(
    array: T[],
    predicate?: (value: T, index: number, array: T[]) => unknown,
    maxSize = Infinity,
): Generator<T, void, void> {
    let count = 0

    for (const [index, item] of array.entries()) {
        if (predicate?.(item, index, array)) {
            yield item
            count++
        }

        if (count > maxSize) {
            return
        }
    }
}

export const getFirst = <T>(item: T | T[]): T => (item instanceof Array ? item[0] : item)

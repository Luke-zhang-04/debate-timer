/**
 * Discord Debate Timer
 *
 * @license BSD-3-Clause
 * @version 1.8.0
 * @author Luke Zhang luke-zhang-04.github.io/
 * @copyright 2020 - 2021 Luke Zhang
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

/**
 * Checks if member has admin permissions
 *
 * @param member - Guild member to check
 * @param adminRoleName Name of admin role and the information
 * @returns If `member` has admin perms
 */
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
 *
 * @param array - Array to filter
 * @param predicate - Function to determine if item matches predicate
 * @param maxSize - Max number of items in filter
 * @returns Generator
 */
export function* filter<T>(
    array: T[],
    predicate?: (value: T, index: number, array: T[]) => unknown,
    maxSize = Infinity,
): Generator<T, void, void> {
    let total = 0

    for (const [index, item] of array.entries()) {
        if (predicate?.(item, index, array)) {
            yield item
            total++
        }

        if (total > maxSize) {
            return
        }
    }
}

type NotFunction<T> = T extends Function ? never : T

type FilterMapPredicate<T, K, Falsey> = (
    value: T,
    index: number,
    matched: number,
    array: T[],
) => Exclude<K, Falsey> | Falsey

export function filterMap<T, K, Falsey>(
    array: T[],
    falsey: NotFunction<Falsey>,
    predicate?: FilterMapPredicate<T, K, Falsey>,
): Generator<K, void, void>

/**
 * If falsey value is missing, it's undefined by default
 */
export function filterMap<T, K, Falsey = undefined>(
    array: T[],
    predicate?: FilterMapPredicate<T, K, Falsey>,
): Generator<K, void, void>

/**
 * Map and filter in one loop
 *
 * @param array - Array to filter and map
 * @param falsey - What a falsey value is. If something strictly matches this value, it will be excluded
 * @param predicate - Predicate function. If this function returns something strictly equal to
 *   falsey, then it will be ignored. It not, the return value will be yielded
 */
export function* filterMap<T, K, Falsey>(
    array: T[],
    falsey?: NotFunction<Falsey> | typeof predicate,
    predicate?: FilterMapPredicate<T, K, Falsey>,
): Generator<K, void, void> {
    const matched = 0
    const _predicate = falsey instanceof Function ? falsey : predicate
    const _falsey = falsey instanceof Function ? undefined : falsey

    for (const [index, item] of array.entries()) {
        const result = _predicate?.(item, index, matched, array)

        if (result !== _falsey) {
            yield result as K
        }
    }
}

/**
 * Counts items in array that match the predicate
 *
 * @param array - Array to count items from
 * @param predicate- Function to determine if item matches predicate
 * @param max - Max number of items to count
 * @returns Number of counted items
 */
export const count = <T>(
    array: T[],
    predicate?: (value: T) => unknown,
    max = Infinity,
): number => {
    let total = 0

    for (const item of array) {
        if (predicate?.(item)) {
            total++
        }

        if (total > max) {
            return total
        }
    }

    return total
}

/**
 * @param item - Item to get
 * @returns If item is an array, the first item in item, otherwise the item itself
 */
export const getFirst = <T>(item: T | T[]): T => (item instanceof Array ? item[0] : item)

/**
 * Produces a random integer between `min` and `max`, non-inclusive
 *
 * @param min - Smallest number, inclusive
 * @param max - Largest number, non-inclusive
 * @returns Random integer between `min` and `max
 */
export const randint = (min: number, max: number): number =>
    Math.floor(Math.random() * ((max = Math.floor(max)) - (min = Math.ceil(min))) + min)

/**
 * Shuffles an array
 *
 * @param array - Array to shuffle
 * @param cycles - Number of shuffle cycles to go through
 * @returns Void; shuffles in-place
 */
export const shuffle = <T>(array: T[], cycles = 1): void => {
    for (let _ = 0; _ < cycles; _++) {
        for (let index = array.length - 1; index > 0; index--) {
            const randonIndex = randint(0, index + 1)
            const temp = array[index]

            array[index] = array[randonIndex]
            array[randonIndex] = temp
        }
    }
}

/**
 * Splits an array into chunks
 *
 * @param arr - Array to split
 * @param chunkSize - Size of array chunks
 */
export const arrayToChunks = <T>(arr: T[], chunkSize = 2): T[][] => {
    const chunks: T[][] = []

    for (let index = 0; index < arr.length; index += chunkSize) {
        chunks.push(arr.slice(index, index + chunkSize))
    }

    return chunks
}

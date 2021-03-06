/**
 * Discord Debate Timer
 *
 * @license BSD-3-Clause
 * @version 1.9.3
 * @author Luke Zhang luke-zhang-04.github.io/
 * @copyright 2020 - 2021 Luke Zhang
 */

import type {Timer} from "."
import {adminRoleName} from "../../getConfig"
import {getTimers} from "./list"
import {hasAdminPerms} from "../../utils"

// One minute
const minute = 60

/* eslint-disable id-length */
/**
 * Main shellsort function
 *
 * @param array - Array to sort
 * @returns Void; sorts in-place
 * @see {@link https://github.com/Luke-zhang-04/Sorting-Algorithms/blob/master/shellSort/index.ts}
 */
const shellSort = <T>(array: T[]): void => {
    let gap = Math.floor(array.length / 2) // Alternate gap sequence 4**iterations + 3 * 2**iterations + 1

    while (gap >= 1) {
        for (let i = gap; i < array.length; i++) {
            // Iterate through array, starting from gap
            const comparator = array[i] // Make comparisons with this
            let index // In case of negative index
            let output = 0 // For accessing x outside the array

            for (let x = i; x > gap - 2; x -= gap) {
                // Iterate throguh array with gap as the step
                output = x // For accessing x outside the array
                if (x - gap < 0) {
                    // In case of negative index
                    index = array.length - x - gap
                } else {
                    index = x - gap
                }

                if (array[index] <= comparator) {
                    // Break when correct spot is found
                    break
                } else {
                    // Otherwise, move elements forward to make space
                    array[x] = array[index]
                }
            }
            array[output] = comparator // Insert comparator in the correct spot
        }
        gap = Math.floor(gap / 2) // Increment the gap
    }
}
/* eslint-enable id-length */

/**
 * Turns seconds into human readable time E.g `formatTime(90)` -> `"1:30"`
 *
 * @param secs - Seconds to format
 * @param forceMinutes - Force the minutes side to be shown even if it's zero
 * @returns The formatted time
 */
export const formatTime = (secs: number, forceMinutes = false): string => {
    // Get the remainder seconds
    const remainingSeconds = secs % minute

    // Get the number of whole minutes
    const minutes = (secs - remainingSeconds) / minute

    /**
     * Add 0 to beginning if remainder seconds is less than 10 E.g `"1:3"` -> `"1:03"`
     */
    const remainingSecondsStr =
        remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds.toString()

    return forceMinutes || minutes > 0 // Return the seconds if no minutes have passed
        ? `${minutes}:${remainingSecondsStr}`
        : secs.toString()
}

/**
 * Gets the smallest number that is not in the array E.g `[0, 1, 4]` -> `3`
 *
 * @param keys - Keys to check
 * @returns Smallest number
 */
export const nextKey = (keys: number[]): number => {
    shellSort(keys) // Sort the keys (just in case)

    if (keys[0] !== 0) {
        return 0
    }

    let lastKey = 0

    for (const key of keys) {
        if (key - lastKey >= 2) {
            return key - 1
        }

        lastKey = key
    }

    return Math.max(...keys) + 1
}

/**
 * Mute a user for 1 second. To be called after 5:15
 *
 * @param guild - Guild object so we can get the user
 * @param user - User object so we can fetch the user
 * @returns Void
 */
export const muteUser = async (guild: Guild | null, user: User): Promise<void> => {
    const member = guild?.member(user) // Get user
    const muteTime = 2500

    if (
        guild?.me?.permissions.has(["MUTE_MEMBERS"]) &&
        member?.voice &&
        !member.voice.selfMute &&
        !member.voice.selfDeaf &&
        !member.voice.serverMute &&
        !member.voice.serverDeaf
    ) {
        await member?.voice.setMute(true, "Your speech is over") // Mute them

        await new Promise((resolve) => {
            // Wait 2.5 seconds
            setTimeout(() => resolve(undefined), muteTime)
        })

        await member?.voice.setMute(false)
    }
}

/**
 * Check if a user is authorized to modify a timer
 *
 * @param member - Guild member to look for an admin role
 * @param author - Author of timer is allowed to modify the timer
 * @param timer - The timer object itself
 */
export const isAuthorizedToModifyTimer = (
    member: GuildMember | null,
    author: User,
    timer: Timer,
): boolean => {
    if (author === null) {
        // No author
        return false
    }

    return (
        author.id === timer.mentionedUid ||
        author.id === timer.creator.id ||
        hasAdminPerms(member, adminRoleName)
    )
}

/**
 * Gets an implicit timer id based off the user
 *
 * @param timers - Object of timers to search
 * @param userId - Id of user that wants to modify the timer
 * @returns String if a timer is found, undefined it more than 1 is found, and 0 if none are found
 */
export const deriveTimerId = (
    timers: {[key: number]: Timer},
    userId: string,
): string | undefined => {
    let key: string | undefined

    for (const [id, timer] of Object.entries(timers)) {
        if (timer.creator.id === userId) {
            if (key) {
                return
            }

            key = id
        }
    }

    return key ?? ""
}

/**
 * Checks the validity of derivedId and derivedNumericId
 *
 * @param derivedId - Derived string id
 * @param derivedNumericId - Derived id in number form
 * @param message - Message object
 * @returns If derivedID and derivedNumericId are valid, and will also send errors to the channels
 */
export const derivedIdIsValid = (
    derivedId: undefined | string,
    derivedNumericId: number,
    {author, channel}: Message,
): derivedId is string => {
    if (derivedId === undefined || isNaN(derivedNumericId)) {
        channel.send(
            `:confused: Multiple timers found for <@${
                author.id
            }>. Please provide the argument [id]. For help using this command, run the \`!help\` command.\n\n${getTimers(
                author,
            )}`,
        )

        return false
    } else if (derivedId === "") {
        channel.send(`:confused: You have no timers <@${author.id}>`)

        return false
    }

    return true
}

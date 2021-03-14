/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.6.1
 * @license BSD-3-Clause
 */
import type {
    Guild,
    GuildMember,
    User
} from "discord.js"
import type {Timer} from "."
import {hasAdminPerms} from "../../utils"

// One minute
const minute = 60

/* eslint-disable id-length */
/**
 * Main shellsort function
 * @see {@link https://github.com/Luke-zhang-04/Sorting-Algorithms/blob/master/shellSort/index.ts}
 * @param array - array to sort
 * @returns void; sorts in-place
 */
const shellSort = <T>(array: T[]): void => {
    let gap = Math.floor(array.length / 2) // Alternate gap sequence 4**iterations + 3 * 2**iterations + 1

    while (gap >= 1) {
        for (let i = gap; i < array.length; i ++) { // Iterate through array, starting from gap
            const comparator = array[i] // Make comparisons with this
            let index // In case of negative index
            let output = 0 // For accessing x outside the array

            for (let x = i; x > gap - 2; x -= gap) { // Iterate throguh array with gap as the step
                output = x // For accessing x outside the array
                if (x - gap < 0) { // In case of negative index
                    index = array.length - x - gap
                } else {
                    index = x - gap
                }

                if (array[index] <= comparator) { // Break when correct spot is found
                    break
                } else { // Otherwise, move elements forward to make space
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
 * Turns seconds into human readable time
 * E.g `formatTime(90)` -> `"1:30"`
 * @param secs - seconds to format
 * @param forceMinutes - force the minutes side to be shown even if it's zero
 * @returns the formatted time
 */
export const formatTime = (secs: number, forceMinutes = false): string => {
    // Get the remainder seconds
    const remainingSeconds = secs % minute

    // Get the number of whole minutes
    const minutes = (secs - remainingSeconds) / minute

    /**
     * Add 0 to beginning if remainder seconds is less than 10
     * E.g `"1:3"` -> `"1:03"`
     */
    const remainingSecondsStr = remainingSeconds < 10
        ? `0${remainingSeconds}`
        : remainingSeconds.toString()

    return forceMinutes || minutes > 0 // Return the seconds if no minutes have passed
        ? `${minutes}:${remainingSecondsStr}`
        : secs.toString()
}

/**
 * Gets the smallest number that is not in the array
 * E.g `[0, 1, 4]` -> `3`
 * @param keys - keys to check
 * @returns smallest number
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
 * @param guild - guild object so we can get the user
 * @param user - user object so we can fetch the user
 * @returns void
 */
export const muteUser = async (
    guild: Guild | null,
    user: User,
): Promise<void> => {
    const member = guild?.member(user) // Get user

    if (member?.voice.connection) {
        member?.voice.setMute(true, "Your speech is over") // Mute them

        await new Promise((resolve) => { // Wait one second
            setTimeout(() => resolve(undefined), 2500)
        })

        member?.voice.setMute(false)
    }
}

/**
 * Check if a user is authorized to modify a timer
 * @param member - guild member to look for an admin role
 * @param author - author of timer is allowed to modify the timer
 * @param timer - the timer object itself
 */
export const isauthorizedToModifyTimer = (
    member: GuildMember | null,
    author: User,
    timer: Timer,
): boolean => {
    if (author === null) { // No author
        return false
    }

    const isAdmin = hasAdminPerms(member)

    console.log({isAdmin})

    return author.id === timer.mentionedUid ||
        author.id === timer.creator.id ||
        isAdmin
}

export default {
    formatTime,
    nextKey,
}

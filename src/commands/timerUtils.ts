/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.3.0
 * @license BSD-3-Clause
 */

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
            let index, // In case of negative index
                output = 0 // For accessing x outside the array

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
 * @returns the formatted time
 */
export const formatTime = (secs: number): string => {
    const remainingSeconds = secs % minute // Get the remainder seconds
    const minutes = (secs - remainingSeconds) / minute // Get the number of whole minutes

    /**
     * Add 0 to beginning if remainder seconds is less than 10
     * E.g `"1:3"` -> `"1:03"`
     */
    const remainingSecondsStr = remainingSeconds < 10
        ? `0${remainingSeconds}`
        : remainingSeconds.toString()

    return minutes > 0 // Return the seconds if no minutes have passed
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

export default {
    formatTime,
    nextKey,
}

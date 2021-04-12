/**
 * Discord Debate Timer
 *
 * @license BSD-3-Clause
 * @version 1.9.1
 * @author Luke Zhang luke-zhang-04.github.io/
 * @copyright 2020 - 2021 Luke Zhang
 */

export const includes = (target, test) => {
    if (!target.includes(test)) {
        throw new Error(`Expected "${target}" to include "${test}"`)
    }
}

export const notIncludes = (target, test) => {
    if (target.includes(test)) {
        throw new Error(`Expected "${target}" to not include "${test}"`)
    }
}

export const includesOneof = (target, ...tests) => {
    for (const test of tests) {
        if (target.includes(test)) {
            return
        }
    }

    throw new Error(`Expected "${target}" to include one of the following:\n${tests}`)
}

export default {
    includes,
    notIncludes,
    includesOneof,
}

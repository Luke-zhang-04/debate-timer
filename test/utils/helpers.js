/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.4.2
 * @license BSD-3-Clause
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

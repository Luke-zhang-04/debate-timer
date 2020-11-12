/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.3.0
 * @license BSD-3-Clause
 */


module.exports.includes = (target, test) => {
    if (!target.includes(test)) {
        throw new Error(`Expected "${target}" to include "${test}"`)
    }
}

module.exports.notIncludes = (target, test) => {
    if (target.includes(test)) {
        throw new Error(`Expected "${target}" to not include "${test}"`)
    }
}

module.exports.includesOneof = (target, ...tests) => {
    for (const test of tests) {
        if (target.includes(test)) {
            return
        }
    }

    throw new Error(`Expected "${target}" to include one of the following:\n${tests}`)
}

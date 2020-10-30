/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.2.0
 * @license BSD-3-Clause
 */

const helpTest = require("./help.js")
const miscTest = require("./misc.js")
const pollTest = require("./poll")

const teamGenTest = require("./teamGen.js")
const timerTest = require("./timer.js")

require("dotenv").config()

describe("Help functions", helpTest)
describe("Miscellaneous functions", miscTest)
describe("Poll functions", pollTest)

if (
    !process.argv.includes("--skip-googlesheets") &&
    !process.argv.includes("--no-googlesheets")
) {
    const randomMotionTest = require("./randomMotion.js")

    describe("Random motion", randomMotionTest)
} else {
    it("SKIPPING GOOGLE SHEETS API TESTING")
}

describe("Team Generation functions", teamGenTest)
describe("Timer functions", timerTest)

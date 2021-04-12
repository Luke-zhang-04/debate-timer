/**
 * Discord Debate Timer
 *
 * @license BSD-3-Clause
 * @version 1.9.1
 * @author Luke Zhang luke-zhang-04.github.io/
 * @copyright 2020 - 2021 Luke Zhang
 */

import dotenv from "dotenv"
import helpTest from "./help.js"
import miscTest from "./misc.js"
import pollTest from "./poll.js"
import teamGenTest from "./teamGen.js"
import timerTest from "./timer.js"

dotenv.config()

describe("Help functions", helpTest)
describe("Miscellaneous functions", miscTest)
describe("Poll functions", pollTest)

if (!process.argv.includes("--skip-googlesheets") && !process.argv.includes("--no-googlesheets")) {
    import("./randomMotion.js").then((randomMotionTest) => {
        describe("Random motion", randomMotionTest)
    })
} else {
    it("SKIPPING GOOGLE SHEETS API TESTING")
}

describe("Team Generation functions", teamGenTest)
describe("Timer functions", timerTest)

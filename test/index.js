/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.0.0
 * @license BSD-3-Clause
 */

const helpTest = require("./help.js")
const miscTest = require("./misc.js")
const randomMotionTest = require("./randomMotion.js")
const teamGenTest = require("./teamGen.js")
const timerTest = require("./timer.js")

describe("Help functions", helpTest)
describe("Miscellaneous functions", miscTest)
describe("Random motion", randomMotionTest)
describe("Team Generation functions", teamGenTest)
describe("Timer functions", timerTest)

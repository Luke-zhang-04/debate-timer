/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.4.2
 * @license BSD-3-Clause
 */

import niceTry from "nice-try"
import {readFileSync} from "fs"
import yaml from "yaml"

// Full configuration object
type FullConfig = {
    prefix: string,
    maxTimers: number,
    maxTimersPerUser: number,
    commandCooldown: number,
    maxMotions: number,
    serverIconUrl: string,
    botIconUrl: string,
    shouldDetectProfanity: boolean,
    shouldUseFuzzyStringMatch: boolean,
    adminRoleName: string,
    emojis: {
        debating: {
            name: string,
            id?: string,
        },
        spectating: {
            name: string,
            id?: string,
        },
    },
    whitelistedWords: string[],
}

// Configuration with optional options that are passed in
type InputConfig = {
    [key: string]: unknown,
    prefix?: string,
    maxTimers?: number,
    maxTimersPerUser?: number,
    commandCooldown?: number,
    maxMotions?: number,
    serverIconUrl?: string,
    botIconUrl?: string,
    shouldDetectProfanity?: boolean,
    shouldUseFuzzyStringMatch?: boolean,
    adminRoleName?: string,
    emojis?: {
        debating: {
            name: string,
            id?: string,
        },
        spectating: {
            name: string,
            id?: string,
        },
    },
    whitelistedWords?: string[],
}

// Default configuration values
const defaultConfig: FullConfig = {
    prefix: "!",
    maxTimers: 10,
    maxTimersPerUser: 3,
    commandCooldown: 1,
    maxMotions: 20,
    serverIconUrl:
        "https://cdn0.iconfinder.com/data/icons/free-social-media-set/24/github-512.png",
    botIconUrl:
        "https://cdn0.iconfinder.com/data/icons/free-social-media-set/24/discord-512.png",
    shouldDetectProfanity: true,
    shouldUseFuzzyStringMatch: true,
    adminRoleName: "admin",
    emojis: {
        debating: {
            name: "speaking_head",
        },
        spectating: {
            name: "eyes",
        },
    },
    whitelistedWords: [],
}

Object.freeze(defaultConfig)

/* eslint-disable complexity */ // Not much we can do
/**
 * Typegaurd for unknown object to make sure it is a good configuration file
 * @param obj - object to check
 * @returns if obj is type inputconfig
 */
const isValidConfig = (obj: {[key: string]: unknown}): obj is InputConfig => (
    (
        typeof obj.prefix === "string" &&
            obj.prefix !== "" && // Prefix isn't empty
            !obj.prefix.includes(" ") || // Prefix has no spaces
        obj.prefix === undefined
    ) && (
        typeof obj.maxTimers === "number" ||
        obj.maxTimers === undefined
    ) && (
        typeof obj.maxCommandTimeGap === "number" ||
        obj.maxCommandTimeGap === undefined
    ) && (
        typeof obj.serverIconUrl === "string" ||
        obj.serverIconUrl === undefined
    ) && (
        typeof obj.botIconUrl === "string" ||
        obj.botIconUrl === undefined
    ) && (
        typeof obj.shouldDetectProfanity === "boolean" ||
        obj.shouldDetectProfanity === undefined
    ) && (
        typeof obj.shouldUseFuzzyStringMatch === "boolean" ||
        obj.shouldUseFuzzyStringMatch === undefined
    ) && (
        typeof obj.adminRoleName === "string" ||
        obj.adminRoleName === undefined
    ) && (
        typeof obj.emojis === "object" ||
        typeof obj.emojis === undefined
    ) && (
        obj.whitelistedWords instanceof Array
    )
)
/* eslint-enable complexity */

// Try and get config.yml from root
let inputConfigFile = niceTry(() => readFileSync("config.yml").toString()) || ""

// If that doesn't work, try .yaml instead
if (inputConfigFile === "") {
    inputConfigFile = niceTry(() => readFileSync("config.yaml").toString()) || ""
}

// If that doesn't work, try .json instead
if (inputConfigFile === "") {
    inputConfigFile = niceTry(() => readFileSync("config.json").toString()) || "{}"
}

// Parse the yaml config
const inputConfig = yaml.parse(inputConfigFile) as {[key: string]: unknown}

// Check for validity
if (!isValidConfig(inputConfig)) {
    throw new Error("Config does not conform to the required structure.")
}

// Full configuration
const fullConfig: InputConfig = {}

/**
 * Check everything in passed in config and fill fullconfig with default or
 * passed in values
 */
for (const [key, val] of Object.entries(defaultConfig)) {
    if (key in inputConfig) {
        fullConfig[key] = inputConfig[key]
    } else {
        fullConfig[key] = val
    }
}

export const {
    prefix,
    maxTimers,
    maxTimersPerUser,
    commandCooldown,
    maxMotions,
    serverIconUrl,
    botIconUrl,
    shouldDetectProfanity,
    shouldUseFuzzyStringMatch,
    adminRoleName,
    emojis,
    whitelistedWords,
} = fullConfig as FullConfig

export default fullConfig as FullConfig

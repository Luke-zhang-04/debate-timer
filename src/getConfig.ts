/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.5.0
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
    defaultTimeCtrl: number,
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
    welcomeMessage?: false | null | {[key: string]: never} | {
        channel: string,
        message: string,
    },
}

// Configuration with optional options that are passed in
type InputConfig = Partial<FullConfig> & {[key: string]: unknown}

// Default configuration values
const defaultConfig: FullConfig = {
    prefix: "!",
    maxTimers: 10,
    maxTimersPerUser: 3,
    commandCooldown: 1,
    maxMotions: 20,
    defaultTimeCtrl: 5,
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
const isValidConfig = (obj: {[key: string]: unknown}): obj is InputConfig => {
    const isValidPrefix = (
            typeof obj.prefix === "string" &&
            obj.prefix !== "" && // Prefix isn't empty
            !obj.prefix.includes(" ") || // Prefix has no spaces
        obj.prefix === undefined
        ),
        isValidWhitelistedWords = (obj.whitelistedWords ?? []) instanceof Array,
        isValidEmojis = typeof obj.emojis === "object",
        isValidWelcomeMessage =
        obj.welcomeMessage === undefined ||
        obj.welcomeMessage === null ||
        obj.welcomeMessage === false ||
        typeof obj.welcomeMessage === "object"

    if (!isValidPrefix) {
        throw new Error("Prefix should be type string, have no spaces, and not be empty")
    } else if (!isValidWhitelistedWords) {
        throw new Error("whitelistedWords should be array or undefined")
    } else if (!isValidEmojis) {
        throw new Error("emojis should be an object")
    } else if (!isValidWelcomeMessage) {
        throw new Error("welcomeMessage should be either undefined, null, false, or an object")
    }

    const singleVerificationKeys: (keyof Partial<FullConfig>)[] = [
        "maxTimers",
        "maxTimersPerUser",
        "commandCooldown",
        "maxMotions",
        "defaultTimeCtrl",
        "serverIconUrl",
        "botIconUrl",
        "shouldDetectProfanity",
        "shouldUseFuzzyStringMatch",
        "adminRoleName",
    ]

    for (const key of singleVerificationKeys) {
        if (
            obj[key] !== undefined &&
            typeof defaultConfig[key] !== typeof obj[key]
        ) {
            return false
        }
    }

    return true
}
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
const fullConfig: FullConfig = {
    ...defaultConfig,
    ...inputConfig,
}

export const {
    prefix,
    maxTimers,
    maxTimersPerUser,
    commandCooldown,
    maxMotions,
    defaultTimeCtrl,
    serverIconUrl,
    botIconUrl,
    shouldDetectProfanity,
    shouldUseFuzzyStringMatch,
    adminRoleName,
    emojis,
    whitelistedWords,
    welcomeMessage,
} = fullConfig

export default fullConfig

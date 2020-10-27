/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.0.0
 * @license BSD-3-Clause
 */

import niceTry from "nice-try"
import {readFileSync} from "fs"
import yaml from "yaml"

// Full configuration object
type FullConfig = {
    [key: string]: string | number | boolean,
    prefix: string,
    maxTimers: number,
    commandCooldown: number,
    maxMotions: number,
    serverIconUrl: string,
    botIconUrl: string,
    shoulddetectProfanity: boolean,
}

// Configuration with optional options that are passed in
type InputConfig = {
    [key: string]: string | number | boolean | undefined,
    prefix?: string,
    maxTimers?: number,
    commandCooldown?: number,
    maxMotions?: number,
    serverIconUrl?: string,
    botIconUrl?: string,
    shoulddetectProfanity?: boolean,
}

// Default configuration values
const defaultConfig: FullConfig = {
    prefix: "!",
    maxTimers: 10,
    commandCooldown: 1,
    maxMotions: 20,
    serverIconUrl:
        "https://cdn.discordapp.com/icons/761650833741185055/c711044b42aba73a09d276030bb3fd0b.png?size=256",
    botIconUrl:
        "https://cdn.discordapp.com/avatars/769340249397657601/ba51e72419970f646c8d61c6624bc27b.png?size=256",
    shoulddetectProfanity: true,
}

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
        typeof obj.shoulddetectProfanity === "boolean" ||
        obj.shoulddetectProfanity === undefined
    )
)

// Try and get config.yml from root
let inputConfigFile = niceTry(() => readFileSync("config.yml").toString()) ?? ""

// If that doesn't work, try .yaml instead
if (inputConfigFile === "") {
    inputConfigFile = niceTry(() => readFileSync("config.yaml").toString()) ?? "{}"
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
    commandCooldown,
    maxMotions,
    serverIconUrl,
    botIconUrl,
    shoulddetectProfanity,
} = fullConfig as FullConfig

export default fullConfig as FullConfig

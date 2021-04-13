/**
 * Discord Debate Timer
 *
 * @license BSD-3-Clause
 * @version 1.9.3
 * @author Luke Zhang luke-zhang-04.github.io/
 * @copyright 2020 - 2021 Luke Zhang
 */

import {emojify, niceTry} from "./utils"
import {readFileSync} from "fs"
import yaml from "yaml"

const permissions = [
    "CREATE_INSTANT_INVITE",
    "KICK_MEMBERS",
    "BAN_MEMBERS",
    "ADMINISTRATOR",
    "MANAGE_CHANNELS",
    "MANAGE_GUILD",
    "ADD_REACTIONS",
    "VIEW_AUDIT_LOG",
    "PRIORITY_SPEAKER",
    "STREAM",
    "VIEW_CHANNEL",
    "SEND_MESSAGES",
    "SEND_TTS_MESSAGES",
    "MANAGE_MESSAGES",
    "EMBED_LINKS",
    "ATTACH_FILES",
    "READ_MESSAGE_HISTORY",
    "MENTION_EVERYONE",
    "USE_EXTERNAL_EMOJIS",
    "VIEW_GUILD_INSIGHTS",
    "CONNECT",
    "SPEAK",
    "MUTE_MEMBERS",
    "DEAFEN_MEMBERS",
    "MOVE_MEMBERS",
    "USE_VAD",
    "CHANGE_NICKNAME",
    "MANAGE_NICKNAMES",
    "MANAGE_ROLES",
    "MANAGE_WEBHOOKS",
    "MANAGE_EMOJIS",
]

// Full configuration object
type FullConfig = {
    prefix: string
    maxTimers: number
    maxTimersPerUser: number
    commandCooldown: number
    maxMotions: number
    defaultTimeCtrl: number
    serverIconUrl: string
    botIconUrl: string
    otherImageUrl: string
    shouldDetectProfanity: boolean
    shouldUseFuzzyStringMatch: boolean
    shouldRespondToUnknownCommand: boolean
    shouldAllowJokes: boolean
    adminRoleName: {
        type: "name" | "permission"
        value: string
    }
    emojis: {
        [key: string]: {
            name: string
            id?: string
        }
    }
    whitelistedWords: string[]
    blacklistedWords: string[]
    welcomeMessage?:
        | false
        | null
        | {[key: string]: never}
        | {
              channel: string
              channelName?: string
              message: string
          }
    verbosity: 0 | 1 | 2
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
    botIconUrl: "https://cdn0.iconfinder.com/data/icons/free-social-media-set/24/discord-512.png",
    otherImageUrl:
        "https://cdn0.iconfinder.com/data/icons/free-social-media-set/24/discord-512.png",
    shouldDetectProfanity: true,
    shouldUseFuzzyStringMatch: true,
    shouldRespondToUnknownCommand: true,
    shouldAllowJokes: true,
    adminRoleName: {
        type: "permission",
        value: "ADMINISTRATOR",
    },
    emojis: {
        debating: {
            name: "speaking_head",
        },
        spectating: {
            name: "eyes",
        },
    },
    whitelistedWords: [],
    blacklistedWords: [],
    verbosity: 2,
}

Object.freeze(defaultConfig)

// Not much we can do
/* eslint-disable complexity, max-lines-per-function */

/**
 * Typegaurd for unknown object to make sure it is a good configuration file
 *
 * @param obj - Object to check
 * @returns If obj is type inputconfig
 */
const isValidConfig = (obj: {[key: string]: unknown}): obj is InputConfig => {
    const isValidPrefix =
        (typeof obj.prefix === "string" &&
            obj.prefix !== "" && // Prefix isn't empty
            !obj.prefix.includes(" ")) || // Prefix has no spaces
        obj.prefix === undefined
    const isValidWhitelistedWords = (obj.whitelistedWords ?? []) instanceof Array
    const isValidBlacklistedWords = (obj.blackListedWords ?? []) instanceof Array
    const isValidEmojis = typeof obj.emojis === "object"
    const isValidWelcomeMessage =
        obj.welcomeMessage === undefined ||
        obj.welcomeMessage === null ||
        obj.welcomeMessage === false ||
        typeof obj.welcomeMessage === "object"
    const isValidVerbosity =
        (typeof (obj.verbosity ?? 2) === "number" && obj.verbosity === undefined) ||
        obj.verbosity === null ||
        ((obj.verbosity as number) >= 0 && (obj.verbosity as number) <= 2)

    if (!isValidPrefix) {
        throw new Error("Prefix should be type string, have no spaces, and not be empty")
    } else if (!isValidWhitelistedWords) {
        throw new Error("whitelistedWords should be array or undefined")
    } else if (!isValidBlacklistedWords) {
        throw new Error("blacklistedWords should be array or undefined")
    } else if (!isValidEmojis) {
        throw new Error("emojis should be an object")
    } else if (!isValidWelcomeMessage) {
        throw new Error("welcomeMessage should be either undefined, null, false, or an object")
    } else if (!isValidVerbosity) {
        throw new Error("verbosity should be either 0, 1, 2, or null/undefined")
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
        "shouldRespondToUnknownCommand",
        "shouldAllowJokes",
    ]

    for (const key of singleVerificationKeys) {
        if (obj[key] !== undefined && typeof defaultConfig[key] !== typeof obj[key]) {
            return false
        }
    }

    if (typeof obj.adminRoleName === "string") {
        const {adminRoleName: roleName} = obj

        if (/^hasPermission:(?<permissionName>[A-Z]|_)/u.test(roleName)) {
            const permission = roleName.slice("hasPermission:".length)

            if (permissions.includes(permission)) {
                obj.adminRoleName = {
                    type: "permission",
                    value: permission,
                }
            } else {
                throw new Error(
                    `adminRoleName permission after hasPermission: must be one of the following:\n\n${permissions.join(
                        ", ",
                    )}`,
                )
            }
        } else {
            obj.adminRoleName = {
                type: "name",
                value: roleName,
            }
        }
    }

    return true
}
/* eslint-enable complexity, max-lines-per-function */

// Try and get config.yml from root
let inputConfigFile =
    niceTry(() =>
        readFileSync(
            process.env.NODE_ENV === "test" ? "config.testing.yml" : "config.yml",
        ).toString(),
    ) || ""

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

// Need to test for emojis
/* eslint-disable no-control-regex */
for (const [usage, info] of Object.entries(fullConfig.emojis)) {
    if (!info.id && !/[^\u0000-\u00ff]/u.test(info.name)) {
        fullConfig.emojis[usage].name = emojify(`:${info.name}:`)
    }
}
/* eslint-enable no-control-regex */

Object.freeze(fullConfig)

export const {
    prefix,
    maxTimers,
    maxTimersPerUser,
    commandCooldown,
    maxMotions,
    defaultTimeCtrl,
    serverIconUrl,
    otherImageUrl,
    botIconUrl,
    shouldDetectProfanity,
    shouldUseFuzzyStringMatch,
    shouldRespondToUnknownCommand,
    shouldAllowJokes,
    adminRoleName,
    emojis,
    whitelistedWords,
    blacklistedWords,
    welcomeMessage,
    verbosity,
} = fullConfig

export default fullConfig

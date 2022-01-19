/**
 * Discord Debate Timer
 *
 * @license BSD-3-Clause
 * @author Luke Zhang luke-zhang-04.github.io/
 * @copyright 2020 - 2021 Luke Zhang
 */

import * as zod from "zod"
import {emojify, niceTry} from "./utils"
import {readFileSync} from "fs"
import yaml from "yaml"

/**
 * Zod transform function factory to turn null values into default
 * @param defaultValue - value to default to
 * @returns zod transform function that turns anything nullable to the default value
 */
const defaultTo =
    <T>(
        defaultValue: T extends boolean ? boolean : T,
    ): ((
        arg: (T extends boolean ? boolean : T) | null | undefined,
    ) => T extends boolean ? boolean : T) =>
    (arg) =>
        arg ?? defaultValue

const getAdminRoleName = (
    roleName: string | typeof adminRoleSchema["_output"],
): {type: "permission" | "name"; value: string} => {
    if (typeof roleName === "string") {
        const permission = roleName.match(/^hasPermission:(?<permissionName>.*)/u)?.groups
            ?.permissionName

        if (permission) {
            return {
                type: "permission",
                value: permission,
            }
        } else {
            return {
                type: "name",
                value: roleName,
            }
        }
    }

    return roleName as {type: "permission" | "name"; value: string}
}

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
] as const

const adminRoleSchema = zod.object({
    type: zod.string().regex(/name|permission/u),
    value: zod.string(),
})

const configSchema = zod.object({
    prefix: zod.string().min(1).nullable().optional().transform(defaultTo("!")),
    maxTimers: zod.number().int().min(1).nullable().optional().transform(defaultTo(10)),
    maxTimersPerUser: zod.number().int().min(1).nullable().optional().transform(defaultTo(3)),
    commandCooldown: zod.number().min(0).nullable().optional().transform(defaultTo(1)),
    maxMotions: zod.number().int().min(1).nullable().optional().transform(defaultTo(20)),
    defaultTimeCtrl: zod.number().min(0).nullable().optional().transform(defaultTo(5)),
    serverIconUrl: zod
        .string()
        .url()
        .nullable()
        .optional()
        .transform(
            defaultTo(
                "https://cdn0.iconfinder.com/data/icons/free-social-media-set/24/github-512.png",
            ),
        ),
    botIconUrl: zod
        .string()
        .url()
        .nullable()
        .optional()
        .transform(
            defaultTo(
                "https://cdn0.iconfinder.com/data/icons/free-social-media-set/24/discord-512.png",
            ),
        ),
    otherImageUrl: zod
        .string()
        .url()
        .nullable()
        .optional()
        .transform(
            defaultTo(
                "https://cdn0.iconfinder.com/data/icons/free-social-media-set/24/discord-512.png",
            ),
        ),
    shouldDetectProfanity: zod.boolean().nullable().optional().transform(defaultTo(true)),
    shouldUseFuzzyStringMatch: zod.boolean().nullable().optional().transform(defaultTo(true)),
    shouldRespondToUnknownCommand: zod.boolean().nullable().optional().transform(defaultTo(true)),
    shouldAllowJokes: zod.boolean().nullable().optional().transform(defaultTo(true)),
    adminRoleName: zod
        .union([adminRoleSchema, zod.string()])
        .default({
            type: "permission",
            value: "ADMINISTRATOR",
        })
        .transform(getAdminRoleName)
        .refine(
            (arg) => permissions.includes(arg.value as typeof permissions[number]),
            "Must be a valid permission",
        ),
    emojis: zod
        .record(
            zod.object({
                name: zod.string(),
                id: zod.string().nullable().optional(),
            }),
        )
        .transform(
            defaultTo<Record<string, {id?: string | null | undefined; name: string}>>({
                debating: {
                    name: "speaking_head",
                },
                spectating: {
                    name: "eyes",
                },
            }),
        ),
    whitelistedWords: zod
        .array(zod.string())
        .nullable()
        .optional()
        .transform(defaultTo<string[]>([])),
    blacklistedWords: zod
        .array(zod.string())
        .nullable()
        .optional()
        .transform(defaultTo<string[]>([])),
    verbosity: zod.number().int().min(0).max(2),
    prepping: zod
        .union([
            zod.string().regex(/^defaults$/u),
            zod.object({
                channelNamesRegex: zod.string().nullable().optional(),
                channelNames: zod
                    .array(zod.string())
                    .nullable()
                    .optional()
                    .default(["OG", "OO", "CG", "CO", "gov", "opp"]),
                roleId: zod.string().nullable().optional(),
                roleName: zod.string().nullable().optional().default("^prep(p|ar)ing$"),
            }),
        ])
        .nullable()
        .optional()
        .transform((val) =>
            typeof val === "string"
                ? {
                      channelNamesRegex: "^([OC][GO]|GOV|OPP)$",
                      channelNames: ["OG", "OO", "CG", "CO", "gov", "opp"],
                      roleId: undefined,
                      roleName: "^prep(p|ar)ing$",
                  }
                : val,
        ),
    welcomeMessage: zod
        .object({
            channel: zod.string().nullable().optional(),
            channelName: zod.string().nullable().optional(),
            message: zod.string(),
        })
        .nullable()
        .optional(),
})

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
const inputConfig = configSchema.parse(yaml.parse(inputConfigFile), {})

// Need to test for emojis
/* eslint-disable no-control-regex */
for (const [usage, info] of Object.entries(inputConfig.emojis)) {
    if (!info.id && !/[^\u0000-\u00ff]/u.test(info.name)) {
        inputConfig.emojis[usage].name = emojify(`:${info.name}:`)
    }
}
/* eslint-enable no-control-regex */

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
    prepping,
    verbosity,
} = inputConfig

export default inputConfig

/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @license MIT
 */

import niceTry from "nice-try"
import {readFileSync} from "fs"
import yaml from "yaml"

type FullConfig = {
    [key: string]: string | number | undefined,
    prefix: string,
    maxTimers: number,
    minCommandTimeGap: number,
    maxMotions: number,
    serverIconUrl: string,
    botIconUrl: string,
}

type InputConfig = {
    [key: string]: string | number | undefined,
    prefix?: string,
    maxTimers?: number,
    minCommandTimeGap?: number,
    maxMotions?: number,
    serverIconUrl?: string,
    botIconUrl?: string,
}

const defaultConfig: FullConfig = {
    prefix: "!",
    maxTimers: 10,
    minCommandTimeGap: 3,
    maxMotions: 20,
    serverIconUrl:
        "https://cdn.discordapp.com/icons/761650833741185055/c711044b42aba73a09d276030bb3fd0b.png?size=256",
    botIconUrl:
        "https://cdn.discordapp.com/avatars/769340249397657601/ba51e72419970f646c8d61c6624bc27b.png?size=256",
}

const isValidConfig = (obj: {[key: string]: unknown}): obj is InputConfig => (
    (
        typeof obj.prefix === "string" ||
        obj.prefix === undefined
    ) &&
    (
        typeof obj.maxTimers === "number" ||
        obj.maxTimers === undefined
    ) &&
    (
        typeof obj.maxCommandTimeGap === "number" ||
        obj.maxCommandTimeGap === undefined
    ) &&
    (
        typeof obj.serverIconUrl === "string" ||
        obj.serverIconUrl === undefined
    ) &&
    (
        typeof obj.botIconUrl === "string" ||
        obj.botIconUrl === undefined
    )
)

let inputConfigFile = niceTry(() => readFileSync("config.yml").toString()) ?? ""

if (inputConfigFile === "") {
    inputConfigFile = niceTry(() => readFileSync("config.ymal").toString()) ?? "{}"
}

const inputConfig = yaml.parse(inputConfigFile) as {[key: string]: unknown}

if (!isValidConfig(inputConfig)) {
    throw new Error("Config does not conform to the required structure.")
}

const fullConfig: InputConfig = {}

for (const [key, val] of Object.entries(defaultConfig)) {
    if (key in inputConfig) {
        fullConfig[key] = inputConfig[key]
    } else {
        fullConfig[key] = val
    }
}

console.log(fullConfig)

export const {
    prefix,
    maxTimers,
    minCommandTimeGap,
    maxMotions,
    serverIconUrl,
    botIconUrl,
} = fullConfig as FullConfig

export default fullConfig as FullConfig

import progress from "rollup-plugin-progress"
import resolve from "@rollup/plugin-node-resolve"
import {terser} from "rollup-plugin-terser"
import typescript from "@rollup/plugin-typescript"

const banner = `#!/bin/node
/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.5.0
 * @license BSD-3-Clause
 * @preserve
 */

`

/**
 * @type {import("rollup").RollupOptions}
 */
const config = {
    input: "src/index.ts",
    output: {
        file: "./bot.mjs",
        format: "esm",
        banner,
    },
    plugins: [
        progress(),
        typescript({
            tsconfig: "./tsconfig.rollup.json",
        }),
        resolve({
            resolveOnly: [/^\.{0,2}\/|tslib/],
        }),
        process.env.NODE_ENV === "dev" ? undefined : terser({
            format: {
                comments: (_, {value}) => (
                    (!(/Luke Zhang/ui).test(value) || (/@preserve/ui).test(value)) &&
                    (/@preserve|li[cs]ense|copyright/ui).test(value)
                ),
            }
        }),
    ]
}

export default config

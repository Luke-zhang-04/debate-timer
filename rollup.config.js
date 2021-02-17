import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import {terser} from "rollup-plugin-terser"

const banner = `#!/bin/node
/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.4.1
 * @license BSD-3-Clause
 * @preserve
 */

`

/**
 * @type {import("rollup").RollupOptions}
 */
const config = {
    input: "lib/index.js",
    output: {
        file: "./bot.js",
        format: "esm",
        banner,
    },
    plugins: [
        commonjs(),
        resolve({
            resolveOnly: [/^\.{0,2}\//],
        }),
        terser({
            format: {
                comments: (_, {value}) => (/@preserve/ui).test(value),
            }
        }),
    ]
}

export default config

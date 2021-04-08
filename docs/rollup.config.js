import {dirname} from "path"
import {fileURLToPath} from "url"
import progress from "rollup-plugin-progress"
import resolve from "@rollup/plugin-node-resolve"
import {terser} from "rollup-plugin-terser"
import typescript from "@rollup/plugin-typescript"

const banner = `/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.8.0
 * @license BSD-3-Clause
 */

`

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * @type {import("rollup").RollupOptions}
 */
const config = {
    input: `${__dirname}/src/index.tsx`,
    output: {
        file: `${__dirname}/js/index.js`,
        format: "iife",
        banner,
    },
    plugins: [
        progress(),
        typescript({
            tsconfig: `${__dirname}/tsconfig.json`,
        }),
        resolve(),
        process.env.NODE_ENV === "dev"
            ? undefined
            : terser({
                  mangle: {
                      properties: {
                          regex: /^_/u, // Mangle private properties
                      },
                  },
              }),
    ],
}

export default config

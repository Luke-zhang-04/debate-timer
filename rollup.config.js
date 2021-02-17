import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import {terser} from "rollup-plugon-terser"

export default {
    input: "lib/index.js",
    output: {
        file: "./bot.js",
        format: "mjs",
    },
    plugins: [
        commonjs(),
        resolve({
            resolveOnly: [/^\.{0,2}\//],
        }),
        terser(),
    ]
}

import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"

export default {
    input: "lib/index.js",
    output: {
        file: "./bot.js",
        format: "cjs",
    },
    plugins: [
        commonjs(),
        resolve({
            resolveOnly: [/^\.{0,2}\//],
        }),
    ]
}

#!/bin/node

import chokidar from "chokidar"
import {exec} from "child_process"

const niceTry = (fn) => {
    try {
        return fn()
    } catch (_) {}
}

const paths = {
    eslint: (flags, dir) => (
        `./node_modules/.bin/eslint_d "${dir}/{**/*.ts,*.ts}" ${flags}`
    ),
}


const runLint = (path) => new Promise((resolve, reject) => {
    try {
        exec(path, (_, stdout, stderr) => {
            if (stderr) {
                console.error(stderr)
                reject(stderr)
            }

            resolve(stdout)
        })
    } catch {
        console.log("An error occured. The linter likely found a problem")
    }
})

const lint = (dir = "*") => {
    const flags = process.argv.includes("--fix") ||
            process.argv.includes("--watch")
        ? "--fix"
        : ""
    const eslint = niceTry(() => runLint(paths.eslint(flags, dir)))

    return Promise.all([eslint])
}

lint()

if (process.argv.includes("--watch")) {
    chokidar.watch("./src").on("change", async () => {
        try {
            await lint("src")
        } catch {
            console.log("An error occured. The linter likely found a problem")
        }

        console.log("Complete!")
    })
}

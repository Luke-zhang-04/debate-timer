/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @version 1.5.0
 * @license BSD-3-Clause
 */

import childProcess from "child_process"
import {hostname} from "os"

/**
 * Run a shell command
 * @param cmd - command to run
 */
const runCommand = (cmd: string): Promise<string> => (
    new Promise((resolve, reject) => {
        childProcess.exec(cmd, (err, stdout, stderr) => {
            if (stderr !== "" && !stderr.includes("WARNING")) { // Ignore warnings
                reject(stderr)
            } else if (err !== null) {
                reject(err)
            }

            resolve(stdout)
        })
    })
)

/**
 * Gets system details including hostname, CPU info, RAM, an uname
 */
export default async (): Promise<string> => {
    // Hardware info
    const version = await runCommand("cat /proc/version"),

        // Platform name
        uname = await runCommand("uname -a"),

        // CPU info
        cpu = await runCommand("lscpu | grep -E \"name\" | tr -s \" \""),

        // Memory (RAM)
        mem = await runCommand(
            "cat /proc/meminfo | grep MemTotal | awk '$3==\"kB\"{$2=$2/1024^2;$3=\"GB\";} 1'",
        )

    return `debate-timer-bot@${hostname()}\n\n${version}\n${cpu}${mem}\n${uname}`
}


/**
 * Discord Debate Timer
 *
 * @license BSD-3-Clause
 * @version 1.9.2
 * @author Luke Zhang luke-zhang-04.github.io/
 * @copyright 2020 - 2021 Luke Zhang
 */

import childProcess from "child_process"
import {hostname} from "os"

/**
 * Run a shell command
 *
 * @param cmd - Command to run
 */
const runCommand = (cmd: string): Promise<string> =>
    new Promise((resolve, reject) => {
        childProcess.exec(cmd, (err, stdout, stderr) => {
            if (stderr !== "" && !stderr.includes("WARNING")) {
                // Ignore warnings
                reject(stderr)
            } else if (err !== null) {
                reject(err)
            }

            resolve(stdout)
        })
    })

/**
 * Gets system details including hostname, CPU info, RAM, an uname
 */
export default async (): Promise<string> => {
    // Hardware info
    const version = await runCommand("cat /proc/version")

    // Platform name
    const uname = await runCommand("uname -a")

    // CPU info
    const cpu = await runCommand('lscpu | grep -E "name" | tr -s " "')

    // Memory (RAM)
    const mem = await runCommand(
        'cat /proc/meminfo | grep MemTotal | awk \'$3=="kB"{$2=$2/1024^2;$3="GB";} 1\'',
    )

    return `debate-timer-bot@${hostname()}\n\n${version}\n${cpu}${mem}\n${uname}`
}

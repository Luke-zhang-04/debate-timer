/**
 * Discord Debate Timer
 *
 * @license BSD-3-Clause
 * @version 1.9.2
 * @author Luke Zhang luke-zhang-04.github.io/
 * @copyright 2020 - 2021 Luke Zhang
 */

import os, {hostname} from "os"
import childProcess from "child_process"

const bytesPerGb = 1_073_741_824
const memPrecision = 1_000_000

let systemInfo: string | undefined

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
                resolve(stderr)
            } else if (err !== null) {
                reject(err)
            }

            resolve(stdout)
        })
    })

const getSystemInfo = async (): Promise<string> => {
    // Hardware info
    const version = await runCommand("cat /proc/version").catch((err) =>
        err instanceof Error ? `${err.name}: ${err.message}` : String(err),
    )

    // Platform name
    const uname = await runCommand("uname -a").catch((err) =>
        err instanceof Error ? `${err.name}: ${err.message}` : String(err),
    )

    // CPU info
    const cpu = os.cpus()[0]?.model ?? "CPU Info unavailable"

    // Memory (RAM)
    const totalMem = Math.round((os.totalmem() * memPrecision) / bytesPerGb) / memPrecision
    const freeMem = Math.round((os.freemem() * memPrecision) / bytesPerGb) / memPrecision

    return `debate-timer-bot@${hostname()}\n\n${version}\nCPU: ${cpu}\nMemory: ${
        totalMem - freeMem
    }GB / ${totalMem}GB\n\n${uname}`
}

/**
 * Gets system details including hostname, CPU info, RAM, an uname
 */
export default async (): Promise<string> => (systemInfo ??= await getSystemInfo())

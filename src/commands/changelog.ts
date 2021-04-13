/**
 * Discord Debate Timer
 *
 * @license BSD-3-Clause
 * @version 1.9.2
 * @author Luke Zhang luke-zhang-04.github.io/
 * @copyright 2020 - 2021 Luke Zhang
 */

import parseChangelog from "changelog-parser"
import {prefix} from "../getConfig"
import semverCoerce from "semver/functions/coerce.js"

type ChangelogVersion = {
    version: string
    title: string
    date: string
    body: string
    parsed: {[key: string]: string[]}
}

type ChangelogData = {
    versions: ChangelogVersion[]
    title: string
    description: string
}

let changelogData: ChangelogData | undefined

const processChangelog = async (): Promise<ChangelogData> =>
    (await parseChangelog("CHANGELOG.md")) as ChangelogData

const formatEntry = (entry: ChangelogVersion): string =>
    `\`\`\`md\n# Changelog\n[Changelog](https://github.com/Luke-zhang-04/debate-timer/blob/master/CHANGELOG.md)\n\n## ${entry.title}\n\n${entry.body}\n\`\`\``

/**
 * Gives info on the changelog
 *
 * @param message - Message object
 */
export const changelog = async (message: Message): Promise<void> => {
    const version: string | undefined = message.content.split(" ")[1]

    if (!version) {
        await message.channel.send(
            `Show the changelog for this bot <https://github.com/Luke-zhang-04/debate-timer/blob/master/CHANGELOG.md>.
The format is based on Keep a Changelog <https://keepachangelog.com/en/1.0.0/>,
and this project adheres (mostly) to Semantic Versioning <https://semver.org/spec/v2.0.0.html>.

- To **list versions**, run \`${prefix}changelog versions\`
- To show the changelog for the **latest version**, run \`${prefix}changelog latest\`
- To show the changelog for a **specific version**, run \`${prefix}changlog [version]\``,
        )

        return
    } else if (version === "latest") {
        const changelogEntry = (changelogData ??= await processChangelog()).versions[0]

        await message.channel.send(formatEntry(changelogEntry))

        return
    } else if (version === "versions") {
        await message.channel.send(
            (changelogData ??= await processChangelog()).versions
                .map((_version, index) => `${_version.version}${index === 0 ? " *[latest]*" : ""}`)
                .join(", "),
        )

        return
    }

    const semverVersion = semverCoerce(version)?.raw
    const changelogEntry = (changelogData ??= await processChangelog()).versions.find(
        (_version) => _version.version === semverVersion || _version.version === version,
    )

    if (!changelogEntry) {
        await message.channel.send(`Could not find changelog entry for version \`${version}\``)

        return
    }

    await message.channel.send(formatEntry(changelogEntry))
}

export default changelog

/**
 * Discord Debate Timer
 *
 * @license BSD-3-Clause
 * @author Luke Zhang luke-zhang-04.github.io/
 * @copyright 2020 - 2021 Luke Zhang
 */

import {prepping} from "../getConfig"
import {Role, VoiceState} from "discord.js"
import RE2 from "re2"

const testNullableRegexString = (regexString: string | null | undefined, test: string): boolean =>
    regexString === null || regexString === undefined ? false : new RE2(regexString).test(test)

const resolveRole = (guild: Guild): Role | undefined =>
    guild.roles.cache.find((role) =>
        Boolean(
            prepping &&
                (prepping.roleId === role.id ||
                    testNullableRegexString(prepping.roleName, role.name)),
        ),
    )

export const onVoiceStateUpdate = async (_: VoiceState, newState: VoiceState): Promise<void> => {
    if (!newState.guild || !newState.member || newState.member.user.bot === true) {
        return
    } else if (!newState.guild.me?.permissions.has("MANAGE_ROLES")) {
        return
    }

    const preppingRole = resolveRole(newState.member.guild)

    if (preppingRole === undefined) {
        return
    }

    if (
        newState.channel &&
        (prepping?.channelNames?.includes(newState.channel.name) ||
            testNullableRegexString(prepping?.channelNamesRegex, newState.channel.name))
    ) {
        if (!newState.member.roles.cache.has(preppingRole.id)) {
            await newState.member.roles.add(preppingRole.id)
        }
    } else if (newState.member.roles.cache.has(preppingRole.id)) {
        await newState.member.roles.remove(preppingRole.id)
    }
}

export default onVoiceStateUpdate

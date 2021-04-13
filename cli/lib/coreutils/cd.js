"use strict";
/**
 * Discord Debate Timer
 *
 * @license BSD-3-Clause
 * @version 1.9.3
 * @author Luke Zhang luke-zhang-04.github.io/
 * @file lets You send messages on the bots behalf
 * @copyright 2020 - 2021 Luke Zhang
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cd = void 0;
const discord_js_1 = __importDefault(require("discord.js"));
/**
 * Change "directory" as in a server, category, or channel
 *
 * @param client - Discord client
 * @param channels - Array of current channels
 * @param newDir - New Dir that was passed in
 */
const cd = (client, channels, newDir) => {
    var _a, _b;
    const dirs = newDir.split("/");
    if (dirs[dirs.length - 1] === "") {
        dirs.pop();
    }
    for (const dir of dirs) {
        if (dir === "..") {
            channels.pop();
        }
        else if (dir === "") {
            channels.length = 0;
        }
        else if (dir !== ".") {
            if (channels.length === 0) {
                const target = client.guilds.cache.find((guild) => guild.name === dir || guild.id === dir);
                if (target === undefined) {
                    return console.log(`cd: "${dir}" no such server`);
                }
                channels.push(target);
            }
            else if (channels.length === 1) {
                const target = (_a = channels[0]) === null || _a === void 0 ? void 0 : _a.channels.cache.find((channel) => (channel.name === dir || channel.id === dir) &&
                    (channel instanceof discord_js_1.default.CategoryChannel ||
                        (channel instanceof discord_js_1.default.TextChannel && channel.parent === null)));
                if (target === undefined) {
                    return console.log(`cd: "${dir}" no such category or text channel`);
                }
                channels.push(target);
            }
            else if (channels[1] instanceof discord_js_1.default.CategoryChannel && channels.length < 3) {
                const target = (_b = channels[0]) === null || _b === void 0 ? void 0 : _b.channels.cache.find((channel) => {
                    var _a;
                    return ((_a = channel.parent) === null || _a === void 0 ? void 0 : _a.name) === channels[1].name &&
                        (channel.name === dir || channel.id === dir) &&
                        channel instanceof discord_js_1.default.TextChannel;
                });
                if (target === undefined) {
                    return console.log(`cd: "${dir}" no such text channel`);
                }
                channels.push(target);
            }
            else if (channels[1] instanceof discord_js_1.default.TextChannel || channels.length >= 3) {
                return console.log('This is a text channel. Did you mean to go back with ".."');
            }
        }
    }
};
exports.cd = cd;

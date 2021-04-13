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
exports.ls = void 0;
const discord_js_1 = __importDefault(require("discord.js"));
const colors_1 = __importDefault(require("../colors"));
/**
 * List all servers, categories, or channels within the current context of the bot
 *
 * @param client - Client to send to
 * @param head - The current server/category/channel
 */
const ls = (client, head, guild) => {
    let items = `${colors_1.default.biBlue}.${colors_1.default.reset}/  ${colors_1.default.biBlue}..${colors_1.default.reset}/  `; // ./ and ../
    if (head === undefined) {
        // Get all servers
        const guilds = client.guilds.cache
            .map((guild) => guild.name)
            .sort()
            .map((name) => `${colors_1.default.biBlue}${name}${colors_1.default.reset}/  `)
            .join("");
        // Format the servers like in Unix ls
        items += guilds;
    }
    else if (head instanceof discord_js_1.default.TextChannel) {
        return items;
    }
    else if (head instanceof discord_js_1.default.Guild) {
        // Get all categories and text channels
        const channels = head.channels.cache
            .filter((channel) => ["text", "category"].includes(channel.type) ? channel.parent === null : false)
            .sort()
            .map((channel) => channel.type === "category"
            ? `${colors_1.default.biGreen}${channel.name}${colors_1.default.reset}/  `
            : `${colors_1.default.reset}${channel.name}  `)
            .join("");
        items += channels;
    }
    else {
        // Get all text channels in this category
        const channels = guild === null || guild === void 0 ? void 0 : guild.channels.cache.filter((channel) => { var _a; return channel.type === "text" && ((_a = channel.parent) === null || _a === void 0 ? void 0 : _a.id) === head.id; }).sort().map((channel) => `${channel.name}/  `).join("");
        items += channels;
    }
    return items;
};
exports.ls = ls;

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
exports.cat = void 0;
const colors_1 = __importDefault(require("../colors"));
/**
 * Like the Unix CAT command, but not really. Cat shows the last 15 messages from a text channel
 *
 * @param channel - Channel to look at
 */
const cat = async (channel) => {
    const replaceFunc = ({ content, mentions }) => {
        let message = content;
        for (const [_, user] of mentions.users) {
            message = message.replace(new RegExp(`<@(!)?${user.id}>`, "gui"), `${colors_1.default.blue}@${user.username}${colors_1.default.reset}`);
        }
        return message;
    };
    const messages = await channel.messages.fetch({ limit: 15 });
    return messages
        .map((message) => `${colors_1.default.biWhite}${message.author.username}${colors_1.default.reset}: ${replaceFunc(message)}`)
        .reverse()
        .join("\n");
};
exports.cat = cat;

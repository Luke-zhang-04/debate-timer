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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const coreutils = __importStar(require("./coreutils"));
const discord_js_1 = __importDefault(require("discord.js"));
const colors_1 = __importDefault(require("./colors"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const ora_1 = __importDefault(require("ora"));
const prompts_1 = __importDefault(require("prompts"));
dotenv_1.default.config();
console.log("Copyright 2020 Luke Zhang. This program comes with ABSOLUTELY NO WARRANTY. This is free software, and you are welcome to redistribute it under certain conditions; see https://github.com/Luke-zhang-04/debate-timer/blob/master/LICENSE for more details.");
exports.client = new discord_js_1.default.Client();
exports.client.login(process.env.AUTHTOKEN);
const connected = new Promise((resolve) => {
    exports.client.once("ready", resolve);
});
const readFile = (path) => new Promise((resolve, reject) => {
    fs_1.default.readFile(path, "utf-8", (err, data) => {
        if (err) {
            return reject(err);
        }
        return resolve(data);
    });
});
(async () => {
    await connected;
    console.log("Connected to client");
    // Get CLI Version
    const { version } = JSON.parse(await readFile("package.json"));
    // Current channel(s) that the user is on
    const channels = [];
    // Fix some weird things when breaking a loop
    let shouldcontinueRunning = true;
    // Current working directory
    let cwd = "/";
    console.log(`\nCLI Version ${version}\n`);
    while (shouldcontinueRunning) {
        const fullCommand = await prompts_1.default({
            // Get input
            type: "text",
            name: "text",
            message: `debate-timer-bot ${Math.round(exports.client.ws.ping)}ms ${cwd} ->`,
        })
            .then(({ text }) => text)
            .catch(() => "");
        if (fullCommand === undefined) {
            // Deal with undefined input
            continue;
        }
        const command = fullCommand.split(" ")[0]; // Name of the command ONLY
        const currentChannel = channels[channels.length - 1];
        switch (command) {
            case "exit":
                console.log("Exiting . . . goodbye!");
                shouldcontinueRunning = false;
                break;
            case "help":
                console.log('Help for CLI:\n"(send | echo) [msg]" sends a message to a channel.\n"cd [server, category, or channel name]" changes your current localtion\n"ls" lists the current channel\'s contents\n"(cat | show)" shows the contents of the current text channel\n"exit" exits the CLI');
                break;
            case "cat":
            case "show":
                await (async () => {
                    const currentGuild = channels[0];
                    // If the bot isn't currently in a text channel, fail
                    if (!(currentChannel instanceof discord_js_1.default.TextChannel)) {
                        console.log("Cannot read from a non-text channel.");
                        return;
                    }
                    else if (currentGuild === undefined) {
                        console.log("No guild found");
                        return;
                    }
                    // Initialize spinner
                    const spinner = ora_1.default({
                        discardStdin: true,
                        spinner: "line",
                        text: `Showing messages from ${cwd} . . .`,
                        color: "blue",
                    }).start();
                    try {
                        const content = await coreutils.cat(currentChannel);
                        spinner.succeed();
                        console.log(content);
                    }
                    catch (err) {
                        err instanceof Error
                            ? spinner.fail(`${colors_1.default.biRed}${err.name}${colors_1.default.red}: ${err.message}${colors_1.default.reset}`)
                            : (() => {
                                spinner.fail(String(err));
                                console.log(err);
                            })();
                    }
                })();
                break;
            case "cd": // Change "directory"
            case "cc":
                // Name of new directory target
                const newDir = fullCommand.split(" ").slice(1).join(" ");
                if (newDir === undefined) {
                    break;
                }
                coreutils.cd(exports.client, channels, newDir);
                cwd = channels
                    .map((channel) => {
                    var _a;
                    return `/${channel instanceof discord_js_1.default.TextChannel ? "#" : ""}${(_a = channel === null || channel === void 0 ? void 0 : channel.name) !== null && _a !== void 0 ? _a : "?"}`;
                })
                    .join("")
                    .trim();
                break;
            case "echo": // Send a message to channel
            case "send":
                await (async () => {
                    // If the bot isn't currently in a text channel, fail
                    if (!(currentChannel instanceof discord_js_1.default.TextChannel)) {
                        console.log("Cannot send to a non-text channel.");
                        return;
                    }
                    // Initialize spinner
                    const spinner = ora_1.default({
                        discardStdin: false,
                        spinner: "line",
                        text: `Sending "${fullCommand.slice(5)}" to ${cwd} . . .`,
                        color: "blue",
                    }).start();
                    try {
                        await currentChannel.send(fullCommand.slice(5));
                        spinner.succeed("Sent");
                    }
                    catch (err) {
                        err instanceof Error
                            ? spinner.fail(`${colors_1.default.biRed}${err.name}${colors_1.default.red}: ${err.message}${colors_1.default.reset}`)
                            : (() => {
                                spinner.fail(String(err));
                                console.log(err);
                            })();
                    }
                })();
                break;
            case "ls": // List "directory"
                console.log(coreutils.ls(exports.client, channels[channels.length - 1], channels[0]));
                break;
            case "":
                break;
            default:
                console.log(`Unknown command "${command}`);
                break;
        }
    }
    exports.client.destroy();
})();

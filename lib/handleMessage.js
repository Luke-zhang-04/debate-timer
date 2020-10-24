"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @license MIT
 */
const bad_words_1 = __importDefault(require("bad-words"));
const help_1 = __importDefault(require("./commands/help"));
const timer_1 = __importDefault(require("./commands/timer"));
// Swear words filter
const filter = new bad_words_1.default();
filter.addWords("dipshit", "dumbass");
/**
 * Handle a command (starts with !)
 * @param message - message object
 * @returns void
 */
const handleCmd = (message) => {
    if (message.content === "!help") {
        message.channel.send(help_1.default());
    }
    else if (message.content === "!bruh") {
        message.channel.send("", { files: ["https://cdn.discordapp.com/icons/761650833741185055/c711044b42aba73a09d276030bb3fd0b.png?size=256"] });
    }
    else if (message.content === "!epic") {
        message.channel.send("", { files: ["https://cdn.discordapp.com/avatars/769340249397657601/ba51e72419970f646c8d61c6624bc27b.png?size=256"] });
    }
    else if (message.content.split(" ")[0] === "!start") {
        timer_1.default.start(message);
    }
    else if (message.content.split(" ")[0] === "!kill") {
        timer_1.default.kill(message.channel, message.content.split(" ")[1]);
    }
    else {
        message.channel.send(`Sorry, the command \`${message.content.slice(1)}\` is not recognized`);
    }
};
exports.default = (message) => {
    try {
        if (!message.author.bot) {
            if (message.content[0] === "!") {
                handleCmd(message);
            }
            else if (filter.isProfane(message.content)) {
                const number = Math.random();
                const author = message.author.id;
                if (number <= 0.7) {
                    message.channel.send(`Hey <@${author}>! That's not very nice!`);
                }
                else if (number <= 0.8) {
                    message.channel.send(`Does your asshole get jealous of all the shit that comes out of your mouth <@${author}>?1`);
                }
                else {
                    message.channel.send(`<@${author}>`, { files: ["https://stayhipp.com/wp-content/uploads/2019/02/you-better-watch.jpg"] });
                }
            }
        }
    }
    catch (err) {
        message.channel.send(`Sorry, this bot has died (crashed) due to an unexpected error ${err}`);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFuZGxlTWVzc2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9oYW5kbGVNZXNzYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7Ozs7O0dBS0c7QUFDSCwwREFBOEI7QUFFOUIsMkRBQWtDO0FBQ2xDLDZEQUFvQztBQUdwQyxxQkFBcUI7QUFDckIsTUFBTSxNQUFNLEdBQUcsSUFBSSxtQkFBTSxFQUFFLENBQUE7QUFFM0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUE7QUFFckM7Ozs7R0FJRztBQUNILE1BQU0sU0FBUyxHQUFHLENBQUMsT0FBZ0IsRUFBUSxFQUFFO0lBQ3pDLElBQUksT0FBTyxDQUFDLE9BQU8sS0FBSyxPQUFPLEVBQUU7UUFDN0IsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBSSxFQUFFLENBQUMsQ0FBQTtLQUMvQjtTQUFNLElBQUksT0FBTyxDQUFDLE9BQU8sS0FBSyxPQUFPLEVBQUU7UUFDcEMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUMsS0FBSyxFQUFFLENBQUMsbUdBQW1HLENBQUMsRUFBQyxDQUFDLENBQUE7S0FDM0k7U0FBTSxJQUFJLE9BQU8sQ0FBQyxPQUFPLEtBQUssT0FBTyxFQUFFO1FBQ3BDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFDLEtBQUssRUFBRSxDQUFDLHFHQUFxRyxDQUFDLEVBQUMsQ0FBQyxDQUFBO0tBQzdJO1NBQU0sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLEVBQUU7UUFDbkQsZUFBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTtLQUN2QjtTQUFNLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssT0FBTyxFQUFFO1FBQ2xELGVBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0tBQzdEO1NBQU07UUFDSCxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLENBQUE7S0FDL0Y7QUFDTCxDQUFDLENBQUE7QUFFRCxrQkFBZSxDQUFDLE9BQWdCLEVBQVEsRUFBRTtJQUN0QyxJQUFJO1FBQ0EsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ3JCLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUU7Z0JBQzVCLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQTthQUNyQjtpQkFBTSxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUMxQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUE7Z0JBQzVCLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFBO2dCQUVoQyxJQUFJLE1BQU0sSUFBSSxHQUFHLEVBQUU7b0JBQ2YsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxNQUFNLDBCQUEwQixDQUFDLENBQUE7aUJBQ2xFO3FCQUFNLElBQUksTUFBTSxJQUFJLEdBQUcsRUFBRTtvQkFDdEIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZ0ZBQWdGLE1BQU0sS0FBSyxDQUFDLENBQUE7aUJBQ3BIO3FCQUFNO29CQUNILE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssTUFBTSxHQUFHLEVBQUUsRUFBQyxLQUFLLEVBQUUsQ0FBQyxzRUFBc0UsQ0FBQyxFQUFDLENBQUMsQ0FBQTtpQkFDMUg7YUFDSjtTQUNKO0tBQ0o7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNWLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGlFQUFpRSxHQUFHLEVBQUUsQ0FBQyxDQUFBO0tBQy9GO0FBQ0wsQ0FBQyxDQUFBIn0=
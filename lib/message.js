"use strict";
/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @license MIT
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const kill_1 = __importDefault(require("./kill"));
const start_1 = __importDefault(require("./start"));
const help = () => `**Debate Timer Bot**
> **!help**
> Get some help

> **!start [nickname]**
> Starts a 5 minute timer with 30 seconds protected time at the start and end.
> Will ping [nickname] for important times
> Will also mute user after 5:20

> **!bruh**
> Otis.

> **!kill [id]**
> Kills a timer with id of [id]
> [id] is an integer value. A timer should display it's while it's ticking.
`;
exports.default = (message, client) => {
    try {
        if (message.content[0] === "!" && !message.author.bot) {
            if (message.content === "!help") {
                message.channel.send(help());
            }
            else if (message.content === "!bruh") {
                message.channel.send("", { files: ["https://cdn.discordapp.com/icons/761650833741185055/c711044b42aba73a09d276030bb3fd0b.png?size=128"] });
            }
            else if (message.content.split(" ")[0] === "!start") {
                start_1.default(message, client);
            }
            else if (message.content.split(" ")[0] === "!kill") {
                kill_1.default(message, Number(message.content.split(" ")[1]));
            }
            else {
                message.channel.send(`Sorry, the command \`${message.content.slice(1)}\` is not recognized`);
            }
        }
        else if (message.content === "fuck you" && !message.author.bot) {
            const number = Math.random();
            if (number <= 0.75) {
                message.channel.send("Hey! That's not very nice!");
            }
            else {
                message.channel.send("Does your asshole get jealous of all the shit that comes out of your mouth?");
            }
        }
    }
    catch (err) {
        message.channel.send(`Sorry, this bot has died (physically) due to an unexpected error ${err}`);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tZXNzYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7R0FLRzs7Ozs7QUFHSCxrREFBeUI7QUFDekIsb0RBQTJCO0FBRTNCLE1BQU0sSUFBSSxHQUFHLEdBQVcsRUFBRSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Q0FlMUIsQ0FBQTtBQUVELGtCQUFlLENBQUMsT0FBZ0IsRUFBRSxNQUFjLEVBQVEsRUFBRTtJQUN0RCxJQUFJO1FBQ0EsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ25ELElBQUksT0FBTyxDQUFDLE9BQU8sS0FBSyxPQUFPLEVBQUU7Z0JBQzdCLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUE7YUFDL0I7aUJBQU0sSUFBSSxPQUFPLENBQUMsT0FBTyxLQUFLLE9BQU8sRUFBRTtnQkFDcEMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUMsS0FBSyxFQUFFLENBQUMsbUdBQW1HLENBQUMsRUFBQyxDQUFDLENBQUE7YUFDM0k7aUJBQU0sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLEVBQUU7Z0JBQ25ELGVBQUssQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUE7YUFDekI7aUJBQU0sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxPQUFPLEVBQUU7Z0JBQ2xELGNBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTthQUN2RDtpQkFBTTtnQkFDSCxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLENBQUE7YUFDL0Y7U0FDSjthQUFNLElBQUksT0FBTyxDQUFDLE9BQU8sS0FBSyxVQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUM5RCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUE7WUFFNUIsSUFBSSxNQUFNLElBQUksSUFBSSxFQUFFO2dCQUNoQixPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxDQUFBO2FBQ3JEO2lCQUFNO2dCQUNILE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLDZFQUE2RSxDQUFDLENBQUE7YUFDdEc7U0FDSjtLQUNKO0lBQUMsT0FBTyxHQUFHLEVBQUU7UUFDVixPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxvRUFBb0UsR0FBRyxFQUFFLENBQUMsQ0FBQTtLQUNsRztBQUNMLENBQUMsQ0FBQSJ9
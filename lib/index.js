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
const discord_js_1 = __importDefault(require("discord.js"));
const dotenv_1 = __importDefault(require("dotenv"));
const handleMessage_1 = __importDefault(require("./handleMessage"));
dotenv_1.default.config();
const client = new discord_js_1.default.Client();
client.login(process.env.AUTHTOKEN);
client.once("ready", () => {
    var _a;
    console.log("Timer bot is online!");
    const channel = client.channels.cache.find((_channel) => (_channel.name === "spam"));
    channel.send("Timer bot is online!");
    (_a = client.user) === null || _a === void 0 ? void 0 : _a.setPresence({
        status: "online",
        activity: {
            name: "for a !command",
            type: "WATCHING",
        },
    });
});
client.on("message", (msg) => handleMessage_1.default(msg));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7OztHQUtHOzs7OztBQUVILDREQUFnQztBQUNoQyxvREFBMkI7QUFDM0Isb0VBQTJDO0FBRTNDLGdCQUFNLENBQUMsTUFBTSxFQUFFLENBQUE7QUFFZixNQUFNLE1BQU0sR0FBRyxJQUFJLG9CQUFPLENBQUMsTUFBTSxFQUFFLENBQUE7QUFFbkMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBRW5DLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTs7SUFDdEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFBO0lBRW5DLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FDcEQsUUFBZ0MsQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUNwRCxDQUF3QixDQUFBO0lBRXpCLE9BQU8sQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQTtJQUVwQyxNQUFBLE1BQU0sQ0FBQyxJQUFJLDBDQUFFLFdBQVcsQ0FBQztRQUNyQixNQUFNLEVBQUUsUUFBUTtRQUNoQixRQUFRLEVBQUU7WUFDTixJQUFJLEVBQUUsZ0JBQWdCO1lBQ3RCLElBQUksRUFBRSxVQUFVO1NBQ25CO0tBQ0osRUFBQztBQUNOLENBQUMsQ0FBQyxDQUFBO0FBRUYsTUFBTSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLHVCQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQSJ9
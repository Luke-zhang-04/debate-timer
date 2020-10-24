"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const minute = 60;
const interval = 5;
const formatTime = (secs) => {
    const remainingSeconds = secs % minute;
    const minutes = (secs - remainingSeconds) / minute;
    const remainingSecondsStr = remainingSeconds < 10
        ? `0${remainingSeconds}`
        : remainingSeconds.toString();
    return minutes > 0
        ? `${minutes}: ${remainingSecondsStr}`
        : secs.toString();
};
const inRange = (actual, expected, margin = 1) => (actual >= expected - margin && actual <= expected + margin);
const pingUser = (message, time, user) => {
    const userTag = user ? `<@${user}>` : "";
    if (inRange(time, 30)) {
        message.channel.send(`${userTag} **0:30** - Protected time is over!`);
    }
    else if (inRange(time, 150)) {
        message.channel.send(`${userTag} **2:30** - You're halfway through your speech!`);
    }
    else if (inRange(time, 270)) {
        message.channel.send(`${userTag} **4:30** - Protected time! Your speech is almost over!`);
    }
    else if (inRange(time, 300)) {
        message.channel.send(`${userTag} **5:00** - Your speech is over! You have 15 seconds of grace time.`);
    }
    else if (inRange(time, 315)) {
        message.channel.send(`${userTag} **5:15** - Your speech is over!`);
    }
};
exports.default = (message, client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = (_a = message.mentions.users.first()) === null || _a === void 0 ? void 0 : _a.id;
    yield message.channel.send(`Starting timer${user ? ` for debater <@${user}>` : ""}!`);
    let time = 0, // Delta time in seconds
    id = null;
    const msg = yield message.channel.send(`Current time: ${formatTime(time)}`);
    const start = Date.now();
    yield new Promise((resolve) => {
        id = setInterval(() => {
            time = Math.round((Date.now() - start) / 1000);
            msg.edit(`Current time: ${formatTime(time)}\nId: ${id !== null && id !== void 0 ? id : "unknown"}`);
            pingUser(message, time, user);
            if (time >= 320) {
                console.log("clearing");
                if (id !== null) {
                    clearInterval(id);
                }
                return resolve();
            }
            return undefined;
        }, interval * 1000);
        msg.edit(`Current time: ${formatTime(time)}\nId: ${id !== null && id !== void 0 ? id : "unknown"}`);
    });
    console.log("done");
    msg.edit(`Speech Finished!`);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvc3RhcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFRQSxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUE7QUFDakIsTUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFBO0FBRWxCLE1BQU0sVUFBVSxHQUFHLENBQUMsSUFBWSxFQUFVLEVBQUU7SUFDeEMsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLEdBQUcsTUFBTSxDQUFBO0lBQ3RDLE1BQU0sT0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHLGdCQUFnQixDQUFDLEdBQUcsTUFBTSxDQUFBO0lBQ2xELE1BQU0sbUJBQW1CLEdBQUcsZ0JBQWdCLEdBQUcsRUFBRTtRQUM3QyxDQUFDLENBQUMsSUFBSSxnQkFBZ0IsRUFBRTtRQUN4QixDQUFDLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLENBQUE7SUFFakMsT0FBTyxPQUFPLEdBQUcsQ0FBQztRQUNkLENBQUMsQ0FBQyxHQUFHLE9BQU8sS0FBSyxtQkFBbUIsRUFBRTtRQUN0QyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFBO0FBQ3pCLENBQUMsQ0FBQTtBQUVELE1BQU0sT0FBTyxHQUFHLENBQUMsTUFBYyxFQUFFLFFBQWdCLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBVyxFQUFFLENBQUMsQ0FDdkUsTUFBTSxJQUFJLFFBQVEsR0FBRyxNQUFNLElBQUksTUFBTSxJQUFJLFFBQVEsR0FBRyxNQUFNLENBQzdELENBQUE7QUFFRCxNQUFNLFFBQVEsR0FBRyxDQUFDLE9BQWdCLEVBQUUsSUFBWSxFQUFFLElBQWEsRUFBUSxFQUFFO0lBQ3JFLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFBO0lBRXhDLElBQUksT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENB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
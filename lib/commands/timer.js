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
exports.start = exports.kill = void 0;
/**
 * Timers get pushed here
 * This keeps track of running timers
 * To kill a timer, the kill() function should be called
 */
const timers = [];
const minute = 60;
/**
 * How often the timer should update in seconds
 * 5 seconds is fine because of server latency
 * Anything smaller might cause issues
 */
const interval = 5;
/**
 * Turns seconds into human readable time
 * E.g `formatTime(90)` -> `"1:30"`
 * @param secs - seconds to format
 * @returns the formatted time
 */
const formatTime = (secs) => {
    const remainingSeconds = secs % minute; // Get the remainder seconds
    const minutes = (secs - remainingSeconds) / minute; // Get the number of whole minutes
    /**
     * Add 0 to beginning if remainder seconds is less than 10
     * E.g `"1:3"` -> `"1:03"`
     */
    const remainingSecondsStr = remainingSeconds < 10
        ? `0${remainingSeconds}`
        : remainingSeconds.toString();
    return minutes > 0 // Return the seconds if no minutes have passed
        ? `${minutes}:${remainingSecondsStr}`
        : secs.toString();
};
/**
 * Checks if a number is within a range
 * E.g `inRange(9, 10)` -> `true`
 *     `inRange(7, 10, 2)` -> `false`
 * @param actual - actual value of number
 * @param expected - expected value of number
 * @param margin - margin for error
 * @returns whether actual is within the margin of error against expected
 */
const inRange = (actual, expected, margin = 1) => (actual >= expected - margin && actual <= expected + margin);
/**
 * Sends a message to the channel to notify everyone that an important time
 * has passed, such as protected times
 * @param message - message object to send message to
 * @param time - current timer of timer
 * @param user - optional user - will ping if exists
 * @returns void
 */
const notifySpeechStatus = (channel, time, user) => {
    const userTag = user ? `<@${user}>` : "";
    if (inRange(time, 30)) {
        channel.send(`${userTag} **0:30** - Protected time is over!`);
    }
    else if (inRange(time, 150)) {
        channel.send(`${userTag} **2:30** - You're halfway through your speech!`);
    }
    else if (inRange(time, 270)) {
        channel.send(`${userTag} **4:30** - Protected time! Your speech is almost over!`);
    }
    else if (inRange(time, 300)) {
        channel.send(`${userTag} **5:00** - Your speech is over! You have 15 seconds of grace time.`);
    }
    else if (inRange(time, 315)) {
        channel.send(`${userTag} **5:15** - Your speech is over!`);
    }
};
/**
 * Mute a user for 1 second. To be called after 5:15
 * @param guild - guild object so we can get the user
 * @param user - user object so we can fetch the user
 * @returns void
 */
const muteUser = (guild, user) => __awaiter(void 0, void 0, void 0, function* () {
    const member = guild === null || guild === void 0 ? void 0 : guild.member(user); // Get user
    if (member === null || member === void 0 ? void 0 : member.voice.connection) {
        member === null || member === void 0 ? void 0 : member.voice.setMute(true, "Your speech is over"); // Mute them
        yield new Promise((resolve) => {
            setTimeout(() => resolve(), 2500);
        });
        member === null || member === void 0 ? void 0 : member.voice.setMute(false);
    }
});
/**
 * Kills a timer with id
 * @param message - message object to send message to
 * @param id - user id - could be undefined, but shouldn't be
 * @returns void
 */
exports.kill = (channel, id) => {
    const numericId = Number(id);
    if (id === undefined) { // Id was never provided. Terminate.
        channel.send("Argument [id] not provided. For help using this command, run the `!help` command.");
        return;
    }
    else if (isNaN(numericId)) { // Id couldn't be parsed as a number. Terminate.
        channel.send(`Could not parse ${id} as a number. Learn to count.`);
        return;
    }
    const num = Math.random();
    if (num < 0.5) {
        channel.send(`Looking for timer with id ${id}`);
    }
    else if (num < 0.75) {
        channel.send(`Sending hitman for timer with id ${id}`);
    }
    else {
        channel.send(`Destroying leftist: Timer ${id} with FACTS and LOGIC`);
    }
    for (const [index, timer] of timers.entries()) { // Iterate through timers array (see top of file)
        if (timer[0].toString() === id) { // If id matches, execute the `kill()` function
            timer[1]();
            Reflect.deleteProperty(timers, index); // Delete this timer from the array
            return;
        }
    }
    channel.send(`Could not find timer with id ${id}`);
};
/* eslint max-lines-per-function: ["error", {"max":50, "skipComments": true, "skipBlankLines": true}] */
/**
 * Start a new timer in background
 * @param message - message object
 * @returns Promise<void>
 */
exports.start = (message) => __awaiter(void 0, void 0, void 0, function* () {
    const user = message.mentions.users.first(); // Mentioned user
    const uid = user === null || user === void 0 ? void 0 : user.id; // Id of aforementioned user
    yield message.channel.send(`Starting timer${uid ? ` for debater <@${uid}>` : ""}!`);
    let time = 0, // Delta time in seconds
    id = null; // Interval id
    /**
     * Keep track of this message, as we're going to consantly edit it and
     * change it's time
     */
    const msg = yield message.channel.send(`Current time: ${formatTime(time)}`);
    /**
     * The starttime of this timer
     * This is important because setInterval() is unreliable, and can lag
     * behind at any time if it wants
     */
    const startTime = Date.now();
    // Wait for timer to resolve with a Promise :)
    yield new Promise((resolve) => {
        id = setInterval(() => {
            // Subtract current time from start time and round to nearest second
            time = Math.round((Date.now() - startTime) / 1000);
            msg.edit(`Current time: ${formatTime(time)}\nId: ${id !== null && id !== void 0 ? id : "unknown"}`);
            notifySpeechStatus(message.channel, time, uid);
            // If speech surpasses 320 seconds (5 minutes 20 seconds)
            if (time >= 320) {
                if (id !== null) {
                    clearInterval(id); // Clear interval
                }
                return resolve(); // Resolve promise
            }
            return undefined;
        }, interval * 1000);
        // Show timer id ASAP
        msg.edit(`Current time: ${formatTime(time)}\nId: ${id !== null && id !== void 0 ? id : "unknown"}`);
        // Push the id and kill function to the timers array
        timers.push([
            Number(`${id}`),
            () => {
                clearInterval(Number(`${id}`));
                resolve();
                message.channel.send(`Killed timer with id ${id}.`);
            },
        ]);
    });
    msg.edit(`Speech Finished!`);
    if (user !== undefined) {
        muteUser(message.guild, user);
    }
});
exports.default = {
    kill: exports.kill,
    start: exports.start,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvdGltZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBaUJBOzs7O0dBSUc7QUFDSCxNQUFNLE1BQU0sR0FBb0MsRUFBRSxDQUFBO0FBRWxELE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQTtBQUVqQjs7OztHQUlHO0FBQ0gsTUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFBO0FBRWxCOzs7OztHQUtHO0FBQ0gsTUFBTSxVQUFVLEdBQUcsQ0FBQyxJQUFZLEVBQVUsRUFBRTtJQUN4QyxNQUFNLGdCQUFnQixHQUFHLElBQUksR0FBRyxNQUFNLENBQUEsQ0FBQyw0QkFBNEI7SUFDbkUsTUFBTSxPQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsZ0JBQWdCLENBQUMsR0FBRyxNQUFNLENBQUEsQ0FBQyxrQ0FBa0M7SUFFckY7OztPQUdHO0lBQ0gsTUFBTSxtQkFBbUIsR0FBRyxnQkFBZ0IsR0FBRyxFQUFFO1FBQzdDLENBQUMsQ0FBQyxJQUFJLGdCQUFnQixFQUFFO1FBQ3hCLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtJQUVqQyxPQUFPLE9BQU8sR0FBRyxDQUFDLENBQUMsK0NBQStDO1FBQzlELENBQUMsQ0FBQyxHQUFHLE9BQU8sSUFBSSxtQkFBbUIsRUFBRTtRQUNyQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFBO0FBQ3pCLENBQUMsQ0FBQTtBQUVEOzs7Ozs7OztHQVFHO0FBQ0gsTUFBTSxPQUFPLEdBQUcsQ0FBQyxNQUFjLEVBQUUsUUFBZ0IsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFXLEVBQUUsQ0FBQyxDQUN2RSxNQUFNLElBQUksUUFBUSxHQUFHLE1BQU0sSUFBSSxNQUFNLElBQUksUUFBUSxHQUFHLE1BQU0sQ0FDN0QsQ0FBQTtBQUVEOzs7Ozs7O0dBT0c7QUFDSCxNQUFNLGtCQUFrQixHQUFHLENB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
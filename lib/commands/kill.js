"use strict";
/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @license MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (message, id) => {
    const numericId = Number(id);
    if (id === undefined) {
        message.channel.send("Argument [id] not provided. For help using this command, run the `!help` command.");
        return;
    }
    else if (isNaN(numericId)) {
        message.channel.send(`Could not parse ${id} as a number. Learn to count.`);
        return;
    }
    clearInterval(numericId);
    message.channel.send(`Killed timer with id ${id}.`);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2lsbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9raWxsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7R0FLRzs7QUFJSCxrQkFBZSxDQUFDLE9BQWdCLEVBQUUsRUFBVyxFQUFRLEVBQUU7SUFDbkQsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBRTVCLElBQUksRUFBRSxLQUFLLFNBQVMsRUFBRTtRQUNsQixPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxtRkFBbUYsQ0FBQyxDQUFBO1FBRXpHLE9BQU07S0FDVDtTQUFNLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1FBQ3pCLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLCtCQUErQixDQUFDLENBQUE7UUFFMUUsT0FBTTtLQUNUO0lBRUQsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0lBRXhCLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLHdCQUF3QixFQUFFLEdBQUcsQ0FBQyxDQUFBO0FBQ3ZELENBQUMsQ0FBQSJ9
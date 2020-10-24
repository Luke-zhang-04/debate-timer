"use strict";
/**
 * Discord Debate Timer
 * @copyright 2020 Luke Zhang
 * @author Luke Zhang luke-zhang-04.github.io/
 * @license MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (message, id) => {
    if (isNaN(id)) {
        message.channel.send(`Could not parse ${id} as a number. Learn to count.`);
        return;
    }
    clearInterval(id);
    message.channel.send(`Killed timer with id ${id}.`);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2lsbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9raWxsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7R0FLRzs7QUFJSCxrQkFBZSxDQUFDLE9BQWdCLEVBQUUsRUFBVSxFQUFRLEVBQUU7SUFDbEQsSUFBSSxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUU7UUFDWCxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSwrQkFBK0IsQ0FBQyxDQUFBO1FBRTFFLE9BQU07S0FDVDtJQUVELGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUVqQixPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxHQUFHLENBQUMsQ0FBQTtBQUN2RCxDQUFDLENBQUEifQ==
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const Command_1 = require("../utils/Command");
exports.command = new Command_1.Command("ping", (message) => {
    void message.channel.send("Pong!");
});

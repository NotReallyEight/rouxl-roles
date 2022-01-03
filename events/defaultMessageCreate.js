"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
const Event_1 = require("../utils/Event");
exports.event = new Event_1.Event("messageCreate", (client, message) => {
    if (message.author.bot)
        return;
    void client.processCommand(message);
});

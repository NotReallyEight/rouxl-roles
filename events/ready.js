"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
const Event_1 = require("../utils/Event");
const Logger_1 = require("../utils/Logger");
exports.event = new Event_1.Event("ready", (client) => {
    Logger_1.Logger.info(`${client.user.tag} is ready.`);
}, {
    once: true,
});

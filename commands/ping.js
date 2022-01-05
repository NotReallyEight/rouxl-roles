"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const Command_1 = require("../utils/Command");
exports.command = new Command_1.Command("ping", (message, _args, client) => {
    const messageReceived = Date.now();
    void message.channel.send({
        embeds: [
            {
                title: "Pong!",
                fields: [
                    {
                        name: "Latency",
                        value: `${messageReceived - message.createdTimestamp}ms`,
                        inline: true,
                    },
                    {
                        name: "WebSocket Latency",
                        value: `${client.ws.ping}ms`,
                        inline: true,
                    },
                ],
            },
        ],
    });
});

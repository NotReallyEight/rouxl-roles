"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const Command_1 = require("../utils/Command");
const Logger_1 = require("../utils/Logger");
const config_1 = require("../config");
exports.command = new Command_1.Command("embed", (message, args) => {
    try {
        let embed;
        let channel;
        if (args[0].startsWith("{")) {
            embed = JSON.parse(args.join(" "));
            if (message.channel.type === "GUILD_TEXT")
                channel = message.channel;
        }
        else {
            const input = args.shift();
            embed = JSON.parse(args.join(" "));
            const possibleChannels = message.guild?.channels.cache.filter((c) => c.name.toLowerCase() === input.toLowerCase() ||
                c.id === input ||
                c.name.toLowerCase().includes(input.toLowerCase()));
            if (!possibleChannels)
                return void message.channel.send("Channel not found.");
            if (possibleChannels.filter((c) => c.isText()).size)
                channel = possibleChannels.toJSON()[0];
            else if (message.mentions.channels.first())
                channel = message.mentions.channels.first();
            else
                return void message.channel.send("Channel not found.");
        }
        void message.react(config_1.config.successEmoji);
        return void channel.send({
            embeds: [embed],
        });
    }
    catch (err) {
        void message.channel.send(`An error has occurred! ${err.message}`);
        Logger_1.Logger.error(err.message);
    }
    return undefined;
}, {
    custom: (message) => {
        if (!config_1.config.staff.includes(message.author.id))
            return false;
        return true;
    },
}, {
    category: "util",
    description: "Send an embed message to a channel.",
    errorMessage: "You do not have permissions to use this command.",
    expectedArguments: "[channel] <json>",
});

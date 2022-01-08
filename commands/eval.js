"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const tslib_1 = require("tslib");
const Command_1 = require("../utils/Command");
const util_1 = (0, tslib_1.__importDefault)(require("util"));
const Logger_1 = require("../utils/Logger");
const config_1 = require("../config");
exports.command = new Command_1.Command("eval", async (message, args, _client) => {
    try {
        const text = args.join(" ");
        let result = (await eval(text));
        const typeOfResult = typeof result;
        if (typeof result === "object") {
            result = util_1.default.inspect(result);
            await message.channel.send({
                embeds: [
                    {
                        title: "Eval",
                        color: config_1.config.commandsEmbedColor,
                        fields: [
                            {
                                name: "Eval Input",
                                value: `\`\`\`js\n${text.slice(0, 1008)}\`\`\``,
                                inline: false,
                            },
                            {
                                name: "Eval Output",
                                value: `\`\`\`js\n${result.toString().slice(0, 1008)}\`\`\``,
                                inline: false,
                            },
                            {
                                name: "Eval Type",
                                value: `\`\`\`js\n${typeOfResult}\`\`\``,
                                inline: false,
                            },
                        ],
                    },
                ],
            });
        }
        else if (typeof result === "undefined")
            await message.channel.send({
                embeds: [
                    {
                        title: "Eval",
                        color: config_1.config.commandsEmbedColor,
                        fields: [
                            {
                                name: "Eval Input",
                                value: `\`\`\`js\n${text.slice(0, 1008)}\`\`\``,
                                inline: false,
                            },
                            {
                                name: "Eval Output",
                                value: `\`\`\`js\nundefined\`\`\``,
                                inline: false,
                            },
                            {
                                name: "Eval Type",
                                value: `\`\`\`js\n${typeOfResult}\`\`\``,
                                inline: false,
                            },
                        ],
                    },
                ],
            });
        else
            await message.channel.send({
                embeds: [
                    {
                        title: "Eval",
                        color: 0xbeeccd,
                        fields: [
                            {
                                name: "Eval Input",
                                value: `\`\`\`js\n${text.slice(0, 1008)}\`\`\``,
                                inline: false,
                            },
                            {
                                name: "Eval Output",
                                value: `\`\`\`js\n${result.toString().slice(0, 1008)}\`\`\``,
                                inline: false,
                            },
                            {
                                name: "Eval Type",
                                value: `\`\`\`js\n${typeOfResult}\`\`\``,
                                inline: false,
                            },
                        ],
                    },
                ],
            });
        void message.react(config_1.config.successEmoji);
    }
    catch (err) {
        Logger_1.Logger.error(err.message);
        void message.channel.send(`${config_1.config.errorEmoji} ${err.message}`);
    }
}, {
    custom: (message) => {
        if (!config_1.config.staff.includes(message.author.id))
            return false;
        return true;
    },
}, {
    category: "dev",
    description: "Evaluates code",
    errorMessage: "You do not have permissions to use this command.",
    expectedArguments: "<code>",
});

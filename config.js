"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.setupClient = void 0;
const tslib_1 = require("tslib");
const dotenv_1 = (0, tslib_1.__importDefault)(require("dotenv"));
const Logger_1 = require("./utils/Logger");
const discord_js_1 = require("discord.js");
dotenv_1.default.config();
const environmentVariables = [
    "TOKEN",
    "PREFIX",
    "GUILD_ID",
    "STAFF",
    "ERROR_EMOJI",
    "SUCCESS_EMOJI",
    "HELP_EMBED_DEV_COMMANDS_EMOJI",
    "HELP_EMBED_MISC_COMMANDS_EMOJI",
    "HELP_EMBED_MOD_COMMANDS_EMOJI",
    "HELP_EMBED_UTIL_COMMANDS_EMOJI",
    "COMMANDS_EMBED_COLOR",
];
function setupClient() {
    for (const variable of environmentVariables)
        if (process.env[variable] == null || process.env[variable] === "") {
            Logger_1.Logger.error(`Missing environment variable: ${variable}`);
            process.exit(1);
        }
}
exports.setupClient = setupClient;
if (isNaN(parseInt(process.env.COMMANDS_EMBED_COLOR)))
    process.env.COMMANDS_EMBED_COLOR = discord_js_1.Util.resolveColor(process.env.COMMANDS_EMBED_COLOR).toString();
else
    process.env.COMMANDS_EMBED_COLOR = parseInt(process.env.COMMANDS_EMBED_COLOR).toString();
exports.config = {
    token: process.env.TOKEN,
    prefix: process.env.PREFIX,
    guildId: process.env.GUILD_ID,
    staff: process.env.STAFF.split(","),
    errorEmoji: process.env.ERROR_EMOJI,
    successEmoji: process.env.SUCCESS_EMOJI,
    helpEmbedDevCommandsEmoji: process.env.HELP_EMBED_DEV_COMMANDS_EMOJI,
    helpEmbedMiscCommandsEmoji: process.env.HELP_EMBED_MISC_COMMANDS_EMOJI,
    helpEmbedModCommandsEmoji: process.env.HELP_EMBED_MOD_COMMANDS_EMOJI,
    helpEmbedUtilCommandsEmoji: process.env.HELP_EMBED_UTIL_COMMANDS_EMOJI,
    commandsEmbedColor: parseInt(process.env.COMMANDS_EMBED_COLOR),
};

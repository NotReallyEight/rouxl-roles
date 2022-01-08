import dotenv from "dotenv";
import { Logger } from "./utils/Logger";
import { Util } from "discord.js";
import type { ColorResolvable } from "discord.js";

dotenv.config();

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

export function setupClient() {
	for (const variable of environmentVariables)
		if (process.env[variable] == null || process.env[variable] === "") {
			Logger.error(`Missing environment variable: ${variable}`);
			process.exit(1);
		}
}

if (isNaN(parseInt(process.env.COMMANDS_EMBED_COLOR!)))
	process.env.COMMANDS_EMBED_COLOR = Util.resolveColor(
		process.env.COMMANDS_EMBED_COLOR! as ColorResolvable
	).toString();
else
	process.env.COMMANDS_EMBED_COLOR = parseInt(
		process.env.COMMANDS_EMBED_COLOR!
	).toString();

export const config = {
	token: process.env.TOKEN!,
	prefix: process.env.PREFIX!,
	guildId: process.env.GUILD_ID!,
	staff: process.env.STAFF!.split(",")!,
	errorEmoji: process.env.ERROR_EMOJI!,
	successEmoji: process.env.SUCCESS_EMOJI!,
	helpEmbedDevCommandsEmoji: process.env.HELP_EMBED_DEV_COMMANDS_EMOJI!,
	helpEmbedMiscCommandsEmoji: process.env.HELP_EMBED_MISC_COMMANDS_EMOJI!,
	helpEmbedModCommandsEmoji: process.env.HELP_EMBED_MOD_COMMANDS_EMOJI!,
	helpEmbedUtilCommandsEmoji: process.env.HELP_EMBED_UTIL_COMMANDS_EMOJI!,
	commandsEmbedColor: parseInt(process.env.COMMANDS_EMBED_COLOR!),
};

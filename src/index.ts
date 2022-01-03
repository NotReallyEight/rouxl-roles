import { Client } from "./utils/Client";
import Discord from "discord.js";
import { join } from "path";
import { config } from "./config";
import { Logger } from "./utils/Logger";

const client = new Client({
	intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES],
	prefix: config.prefix!,
	token: config.token!,
});

void (async () => {
	try {
		await client.addEvents(join(__dirname, "events"));
		await client.addCommands(join(__dirname, "commands", "text"));
		await client.login(config.token).catch((error) => {
			Logger.error((error as Error).message);
		});
	} catch (err: any) {
		Logger.error((err as Error).message);
	}
})();

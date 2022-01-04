import { Command } from "../utils/Command";
import type { APIEmbed } from "discord-api-types";
import type { BaseGuildTextChannel } from "discord.js";
import { Logger } from "../utils/Logger";

export const command = new Command("embed", (message, args) => {
	try {
		let embed: APIEmbed;
		let channel: BaseGuildTextChannel;
		if (args[0].startsWith("{")) {
			embed = JSON.parse(args.join(" ")) as APIEmbed;
			if (message.channel.type === "GUILD_TEXT")
				channel = message.channel as BaseGuildTextChannel;
		} else {
			const input = args.shift();
			embed = JSON.parse(args.join(" ")) as APIEmbed;
			const possibleChannels = message.guild?.channels.cache.filter(
				(c) =>
					c.name.toLowerCase() === input!.toLowerCase() ||
					c.id === input! ||
					c.name.toLowerCase().includes(input!.toLowerCase())
			);

			if (!possibleChannels)
				return void message.channel.send("Channel not found.");

			if (possibleChannels.filter((c) => c.isText()).size)
				channel = possibleChannels.toJSON()[0] as BaseGuildTextChannel;
			else if (message.mentions.channels.first())
				channel = message.mentions.channels.first() as BaseGuildTextChannel;
			else return void message.channel.send("Channel not found.");
		}

		return void channel!.send({
			embeds: [embed],
		});
	} catch (err: any) {
		void message.channel.send(
			`An error has occurred! ${(err as Error).message}`
		);
		Logger.error((err as Error).message);
	}

	return undefined;
});

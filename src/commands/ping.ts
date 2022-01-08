import { config } from "../config";
import { Command } from "../utils/Command";

export const command = new Command(
	"ping",
	(message, _args, client) => {
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
					color: config.commandsEmbedColor,
				},
			],
		});
		void message.react(config.successEmoji);
	},
	undefined,
	{
		category: "misc",
		description: "Check the latency of the bot.",
	}
);

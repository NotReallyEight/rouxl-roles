import type { APIEmbed, APIEmbedField } from "discord-api-types";
import { config } from "../config";
import { Command } from "../utils/Command";

export const command = new Command(
	["help", "h"],
	async (message, args, client) => {
		if (args.length) {
			const specificCommandInformation = client.commands.find((c) =>
				c.names.includes(args[0].toLowerCase())
			);

			if (!specificCommandInformation)
				return void message.channel.send(
					`${config.errorEmoji} Command not found.`
				);

			if (
				!(await specificCommandInformation.checkPermissions(
					message,
					args,
					client
				))
			)
				return void message.channel.send(
					`${config.errorEmoji} Command not found.`
				);

			const prefix = client.getPrefixForMessage(message);

			let helpMessage = "";

			if (specificCommandInformation.description != null)
				helpMessage += `**Description:** ${specificCommandInformation.description}\n`;
			if (specificCommandInformation.expectedArguments != null)
				helpMessage += `**Usage:** \`${
					prefix[0].includes(client.user!.id) ? "" : prefix[0]
				}${specificCommandInformation.names[0]} ${
					specificCommandInformation.expectedArguments
				}\`\n`;
			if (specificCommandInformation.names.length > 1)
				helpMessage += `**Aliases:** ${specificCommandInformation.names
					.slice(1)
					.join(", ")}\n`;

			switch (specificCommandInformation.category) {
				case "dev":
					helpMessage += `**Category:** Developer`;
					break;
				case "misc":
					helpMessage += `**Category:** Miscellaneous`;
					break;
				case "mod":
					helpMessage += `**Category:** Moderation`;
					break;
				case "util":
					helpMessage += `**Category:** Utilities`;
					break;
				default:
					helpMessage += `**Category:** Unknown`;
					break;
			}

			const embed: APIEmbed = {
				title: `${specificCommandInformation.names[0]}`,
				description: helpMessage,
				color: config.commandsEmbedColor,
			};

			return void message.channel.send({
				embeds: [embed],
			});
		}
		const prefix = client.getPrefixForMessage(message);
		const commandFields: APIEmbedField[] = [];

		if (config.staff.includes(message.author.id))
			commandFields.push({
				name: `${config.helpEmbedDevCommandsEmoji} Developer Commands`,
				value: client.commands
					.filter((c) => c.category === "dev")
					.map(
						(c) =>
							`\`${prefix[0].includes(client.user!.id) ? "" : prefix[0]}${
								c.names[0]
							}\``
					)
					.join(", "),
				inline: true,
			});

		if (client.commands.filter((c) => c.category === "misc").length)
			commandFields.push({
				name: `${config.helpEmbedMiscCommandsEmoji} Miscellaneous Commands`,
				value: client.commands
					.filter((c) => c.category === "misc")
					.map(
						(c) =>
							`\`${prefix[0].includes(client.user!.id) ? "" : prefix[0]}${
								c.names[0]
							}\``
					)
					.join(", "),
				inline: true,
			});

		if (client.commands.filter((c) => c.category === "mod").length)
			commandFields.push({
				name: `${config.helpEmbedModCommandsEmoji} Moderation Commands`,
				value: client.commands
					.filter((c) => c.category === "mod")
					.map(
						(c) =>
							`\`${prefix[0].includes(client.user!.id) ? "" : prefix[0]}${
								c.names[0]
							}\``
					)
					.join(", "),
			});

		if (client.commands.filter((c) => c.category === "util").length)
			commandFields.push({
				name: `${config.helpEmbedUtilCommandsEmoji} Utility Commands`,
				value: client.commands
					.filter((c) => c.category === "util")
					.map(
						(c) =>
							`\`${prefix[0].includes(client.user!.id) ? "" : prefix[0]}${
								c.names[0]
							}\``
					)
					.join(", "),
			});

		const embed: APIEmbed = {
			title: `${client.user!.username} Commands`,
			fields: commandFields,
			color: config.commandsEmbedColor,
		};
		return void message.channel.send({ embeds: [embed] });
	},
	undefined,
	{
		category: "misc",
		description:
			"Get a list of commands or information about a specific command.",
		expectedArguments: "[command]",
	}
);

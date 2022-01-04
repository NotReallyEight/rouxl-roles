import { Command } from "../utils/Command";
import util from "util";
import { Logger } from "../utils/Logger";

export const command = new Command("eval", async (message, args, _client) => {
	try {
		const text = args.join(" ");

		let result: string = (await eval(text)) as string;
		const typeOfResult = typeof result;
		if (typeof result === "object") {
			result = util.inspect(result);
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
		} else if (typeof result === "undefined")
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
	} catch (err: any) {
		Logger.error((err as Error).message);
	}
});

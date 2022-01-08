import Discord from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import type ButtonEvent from "./ButtonEvent";
import type { Command } from "./Command";
import type { Event } from "./Event";

export interface ClientOptions extends Discord.ClientOptions {
	prefix: string;
	token: string;
}

export interface EventImport {
	event: Event<keyof Discord.ClientEvents>;
}

export interface CommandImport {
	command: Command;
}

export class Client extends Discord.Client {
	commands: Command[] = [];
	buttonEvents: ButtonEvent[] = [];
	prefix: string;
	constructor(options: ClientOptions) {
		super(options);
		this.prefix = options.prefix;
	}

	public async addCommands(path: string): Promise<this> {
		const commandFiles = readdirSync(path);

		for (const file of commandFiles) {
			// eslint-disable-next-line no-await-in-loop
			const { command } = (await import(join(path, file))) as CommandImport;

			this.commands.push(command);
		}
		return this;
	}

	public async addEvents(path: string): Promise<this> {
		const eventFiles = readdirSync(path);

		for (const file of eventFiles) {
			// eslint-disable-next-line no-await-in-loop
			const { event } = (await import(join(path, file))) as EventImport;

			if (event.once ?? false)
				this.once(event.event, (...args) => {
					void event.listener(this, ...args);
				});
			else
				this.on(event.event, (...args) => {
					void event.listener(this, ...args);
				});
		}
		return this;
	}

	public getPrefixForMessage(message: Discord.Message): string[] {
		if (message.content.match(this.mentionPrefixRegExp()!)?.length != null)
			return [`<@!${this.user!.id}>`];

		return [this.prefix];
	}

	public hasCommand(
		message: Discord.Message
	): [string, string, ...string[]] | null {
		const matchResult = this.splitPrefixFromContent(message);
		if (!matchResult) return null;

		const [prefix, content] = matchResult;

		if (!content) {
			if (!prefix || !prefix.match(this.mentionPrefixRegExp()!)) return null;
			return [prefix, ""];
		}

		const args = content.split(" ").filter((arg) => arg !== "");
		const commandName = args.shift();
		if (commandName === undefined) return null;
		return [prefix, commandName.toLowerCase(), ...args];
	}

	public mentionPrefixRegExp(): RegExp | null {
		if (this.user) return new RegExp(`^<@!?${this.user.id}>\\s?`);
		return null;
	}

	public async processCommand(message: Discord.Message): Promise<boolean> {
		const commandInformation = this.hasCommand(message);
		if (!commandInformation) return false;
		const [_prefix, commandName, ...args] = commandInformation;

		const command =
			this.commands.find((c) => c.names.includes(commandName)) ?? null;

		if (!command) return false;

		await command.execute(message, args, this);

		return true;
	}

	public splitPrefixFromContent(
		message: Discord.Message
	): [string, string] | null {
		const prefixes = this.getPrefixForMessage(message);

		for (const prefix of prefixes)
			if (message.content.toLowerCase().startsWith(prefix.toLowerCase()))
				return [prefix, message.content.slice(prefix.length)];

		const match = message.content.match(this.mentionPrefixRegExp()!);
		if (match) return [match[0], message.content.slice(match[0].length)];

		if (!(message.channel instanceof Discord.GuildChannel))
			return ["", message.content];

		return null;
	}

	public async wait(milliseconds: number): Promise<void> {
		return new Promise((resolve) => {
			setTimeout(resolve, milliseconds);
		});
	}
}

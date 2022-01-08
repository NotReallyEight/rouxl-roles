import type Discord from "discord.js";
import { config } from "../config";
import type { Client } from "./Client";
import { Logger } from "./Logger";

export interface CommandRequirements {
	custom?: (
		message: Discord.Message,
		args: string[],
		client: Client
	) => Promise<boolean> | boolean;
}

export interface CommandFn {
	(message: Discord.Message, args: string[], client: Client): void;
}

export interface CommandOptions {
	description?: string;
	expectedArguments?: string;
	errorMessage?: string;
	category?: "dev" | "misc" | "mod" | "util";
}

export class Command {
	names: string[];
	fn: CommandFn;
	requirements: CommandRequirements;
	description?: string;
	expectedArguments?: string;
	errorMessage?: string;
	category: "dev" | "misc" | "mod" | "util";
	constructor(
		names: string[] | string,
		fn: CommandFn,
		requirements?: CommandRequirements,
		options?: CommandOptions
	) {
		if (Array.isArray(names)) this.names = names;
		else this.names = [names];

		if (!this.names[0]) Logger.error("No command names set.");
		this.fn = fn;
		this.requirements = {};
		if (requirements)
			if (requirements.custom) this.requirements.custom = requirements.custom;

		if (options?.description != null) this.description = options.description;

		if (options?.expectedArguments != null)
			this.expectedArguments = options.expectedArguments;

		if (options?.expectedArguments != null)
			this.errorMessage = options.errorMessage;

		if (options?.category != null) this.category = options.category;
		else this.category = "misc";
	}

	public async checkPermissions(
		message: Discord.Message,
		args: string[],
		client: Client
	): Promise<boolean> {
		return this.enoughRequirements(this.requirements, message, args, client);
	}

	public async execute(
		message: Discord.Message,
		args: string[],
		client: Client
	): Promise<boolean> {
		if (!(await this.checkPermissions(message, args, client))) {
			if (this.errorMessage != null)
				void message.channel.send(config.errorEmoji + this.errorMessage);
			return false;
		}
		this.fn(message, args, client);

		return true;
	}

	private async enoughRequirements(
		requirements: CommandRequirements,
		message: Discord.Message,
		args: string[],
		client: Client
	): Promise<boolean> {
		const { custom } = requirements;

		if (custom && !(await custom(message, args, client))) return false;

		return true;
	}
}

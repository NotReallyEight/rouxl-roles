import { Event } from "../utils/Event";

export const event = new Event("messageCreate", (client, message) => {
	if (message.author.bot) return;

	void client.processCommand(message);
});

import { Command } from "../../utils/Command";

export const command = new Command("ping", (message) => {
	void message.channel.send("Pong!");
});

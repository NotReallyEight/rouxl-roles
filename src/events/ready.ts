import { Event } from "../utils/Event";
import { Logger } from "../utils/Logger";

export const event = new Event("ready", (client) => {
	Logger.info(`${client.user!.tag} is ready.`);
});

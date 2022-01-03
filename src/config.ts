import dotenv from "dotenv";

dotenv.config();

export const config = {
	token: process.env.TOKEN,
	prefix: process.env.PREFIX,
	guildId: process.env.GUILD_ID,
};

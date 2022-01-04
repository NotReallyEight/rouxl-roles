"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const tslib_1 = require("tslib");
const discord_js_1 = (0, tslib_1.__importDefault)(require("discord.js"));
const fs_1 = require("fs");
const path_1 = require("path");
class Client extends discord_js_1.default.Client {
    constructor(options) {
        super(options);
        this.commands = [];
        this.componentEvents = [];
        this.prefix = options.prefix;
    }
    async addCommands(path) {
        const commandFiles = (0, fs_1.readdirSync)(path);
        for (const file of commandFiles) {
            // eslint-disable-next-line no-await-in-loop
            const { command } = (await Promise.resolve().then(() => (0, tslib_1.__importStar)(require((0, path_1.join)(path, file)))));
            this.commands.push(command);
        }
        return this;
    }
    async addEvents(path) {
        const eventFiles = (0, fs_1.readdirSync)(path);
        for (const file of eventFiles) {
            // eslint-disable-next-line no-await-in-loop
            const { event } = (await Promise.resolve().then(() => (0, tslib_1.__importStar)(require((0, path_1.join)(path, file)))));
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
    getPrefixesForMessage() {
        const prefixes = [this.prefix];
        return prefixes;
    }
    hasCommand(message) {
        const matchResult = this.splitPrefixFromContent(message);
        if (!matchResult)
            return null;
        const [prefix, content] = matchResult;
        if (!content) {
            if (!prefix || !prefix.match(this.mentionPrefixRegExp()))
                return null;
            return [prefix, ""];
        }
        const args = content.split(" ");
        const commandName = args.shift();
        if (commandName === undefined)
            return null;
        return [prefix, commandName.toLowerCase(), ...args];
    }
    mentionPrefixRegExp() {
        if (this.user)
            return new RegExp(`^<@!?${this.user.id}>\\s?`);
        return null;
    }
    async processCommand(message) {
        const commandInformation = this.hasCommand(message);
        if (!commandInformation)
            return false;
        const [_prefix, commandName, ...args] = commandInformation;
        const command = this.commands.find((c) => c.names.includes(commandName)) ?? null;
        if (!command)
            return false;
        await command.execute(message, args, this);
        return true;
    }
    splitPrefixFromContent(message) {
        const prefixes = this.getPrefixesForMessage();
        for (const prefix of prefixes)
            if (message.content.toLowerCase().startsWith(prefix.toLowerCase()))
                return [prefix, message.content.slice(prefix.length)];
        const match = message.content.match(this.mentionPrefixRegExp());
        if (match)
            return [match[0], message.content.slice(match[0].length)];
        if (!(message.channel instanceof discord_js_1.default.GuildChannel))
            return ["", message.content];
        return null;
    }
    async wait(milliseconds) {
        return new Promise((resolve) => {
            setTimeout(resolve, milliseconds);
        });
    }
}
exports.Client = Client;

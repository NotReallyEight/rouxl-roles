"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
const config_1 = require("../config");
const Logger_1 = require("./Logger");
class Command {
    constructor(names, fn, requirements, options) {
        if (Array.isArray(names))
            this.names = names;
        else
            this.names = [names];
        if (!this.names[0])
            Logger_1.Logger.error("No command names set.");
        this.fn = fn;
        this.requirements = {};
        if (requirements)
            if (requirements.custom)
                this.requirements.custom = requirements.custom;
        if (options?.description != null)
            this.description = options.description;
        if (options?.expectedArguments != null)
            this.expectedArguments = options.expectedArguments;
        if (options?.expectedArguments != null)
            this.errorMessage = options.errorMessage;
        if (options?.category != null)
            this.category = options.category;
        else
            this.category = "misc";
    }
    async checkPermissions(message, args, client) {
        return this.enoughRequirements(this.requirements, message, args, client);
    }
    async execute(message, args, client) {
        if (!(await this.checkPermissions(message, args, client))) {
            if (this.errorMessage != null)
                void message.channel.send(config_1.config.errorEmoji + this.errorMessage);
            return false;
        }
        this.fn(message, args, client);
        return true;
    }
    async enoughRequirements(requirements, message, args, client) {
        const { custom } = requirements;
        if (custom && !(await custom(message, args, client)))
            return false;
        return true;
    }
}
exports.Command = Command;
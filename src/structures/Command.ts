import { RESTPostAPIChatInputApplicationCommandsJSONBody, SlashCommandBuilder } from "discord.js";

export default class Command {
    private data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    
    name: string;
    execute: Function;

    constructor(data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">, execute: Function) {
        this.data = data;
        this.name = data.name;
        this.execute = execute;
    }

    toJSON(): RESTPostAPIChatInputApplicationCommandsJSONBody {
        return this.data.toJSON();
    }
}
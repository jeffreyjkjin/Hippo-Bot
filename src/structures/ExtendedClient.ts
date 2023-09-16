import { Client, Collection, GatewayIntentBits } from 'discord.js'
import fs from 'node:fs'
import path from 'node:path'

import Command from './Command';

export default class ExtendedClient extends Client {
    commands: Collection<string, Command>;

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        });

        this.commands = new Collection<string, Command>();

        this.loadCommands();
    }

    private loadCommands() {
        const commandPath: string = path.join(__dirname, '../commands');
        const commandFiles: string[] = fs.readdirSync(commandPath).filter((file: string): boolean => { 
            return file.endsWith('.ts' || '.js'); 
        });

        commandFiles.forEach((file: string) => {
            const filePath: string = path.join(commandPath, file);
            const command: Command = require(filePath);

            console.log(`Loading command: ${command.name}`);
            this.commands.set(command.name, command);
        });
    }
}
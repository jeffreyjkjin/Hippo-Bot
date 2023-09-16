import { Client, Collection, GatewayIntentBits, REST, Routes } from 'discord.js'
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
        this.registerCommands();
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

    private async registerCommands() {
        const rest: REST = new REST().setToken(process.env.TOKEN);

        (async () => {
            try {
                await rest.put(
                    Routes.applicationCommands(process.env.CLIENT_ID), 
                    // Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), 
                    { 
                        body: this.commands.map((command) => { 
                            console.log(`Registering command: ${command.name}`);
                            return command.toJSON(); 
                        })
                    }
                );
            } catch (e) {
                console.log(e);
            }
        })();
        
    }
}
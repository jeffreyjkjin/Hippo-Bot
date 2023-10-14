import { Client, Collection, GatewayIntentBits, REST, Routes } from 'discord.js'
import { MongoClient } from 'mongodb'
import fs from 'node:fs'
import path from 'node:path'

import Button from './Button'
import Command from './Command'
import Modal from './Modal'

export default class ExtendedClient extends Client {
    commands: Collection<string, Command>;
    buttons: Collection<string, Button>;
    modals: Collection<string, Modal>;
 
    mongo: MongoClient;

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

        this.buttons = new Collection<string, Button>();
        this.loadButtons();
        
        this.modals = new Collection<string, Modal>();
        this.loadModals();

        this.mongo = new MongoClient(process.env.MONGO);
        this.connectMongo();
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
                    Routes.applicationCommands(process.env.CLIENT), 
                    // Routes.applicationGuildCommands(process.env.CLIENT, process.env.GUILD), 
                    { 
                        body: this.commands.map((command) => { 
                            console.log(`Registering command: ${command.name}`);
                            return command.toJSON(); 
                        })
                    }
                );
            } catch (e: any) {
                console.log(e);
            }
        })();
        
    }

    private async loadButtons() {
        const buttonPath: string = path.join(__dirname, '../buttons');
        const buttonFiles: string[] = fs.readdirSync(buttonPath).filter((file: string): boolean => { 
            return file.endsWith('.ts' || '.js'); 
        });

        buttonFiles.forEach((file: string) => {
            const filePath: string = path.join(buttonPath, file);
            const button: Button = require(filePath);

            console.log(`Loading button: ${button.id}`);
            this.buttons.set(button.id, button);
        });        
    }


    private async loadModals() {
        const modalPath: string = path.join(__dirname, '../modals');
        const modalFiles: string[] = fs.readdirSync(modalPath).filter((file: string): boolean => { 
            return file.endsWith('.ts' || '.js'); 
        });

        modalFiles.forEach((file: string) => {
            const filePath: string = path.join(modalPath, file);
            const modal: Modal = require(filePath);

            console.log(`Loading modal: ${modal.id}`);
            this.modals.set(modal.id, modal);
        });        
    }

    private async connectMongo() {
        try {
            await this.mongo.connect();
            await this.mongo.db('hippobot').command({ ping: 1 });
            console.log('Connected to MongoDB!');
        }
        catch (e: any) {
            console.log(e);
        }

    }
}
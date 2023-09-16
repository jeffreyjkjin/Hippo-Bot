import { Client, Collection, GatewayIntentBits } from 'discord.js'

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
    }
}
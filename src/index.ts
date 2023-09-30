import { CacheType, Interaction } from 'discord.js'
import { config } from 'dotenv'

import Button from './structures/Button'
import Command from './structures/Command'
import ExtendedClient from './structures/ExtendedClient'

config();

const client: ExtendedClient = new ExtendedClient();

client.on('ready', () => {
    console.log(`${client.user && client.user.tag} is online!`);
});

client.on('interactionCreate', async (i: Interaction<CacheType>) => {
    if (i.isChatInputCommand()) {
        const command: Command = client.commands.get(i.commandName);

        if (!command) {
            await i.followUp({ 
                content: `No command matching ${i.commandName} was found.`, 
                ephemeral: true
            });
            return;
        }

        try {
            await command.execute(i);
        } 
        catch (e) {
            console.error(e);
            await i.followUp({ 
                content: 'There was an error while executing this command.',
                ephemeral: true
            });
        }
    }
    else if (i.isButton()) {
        const button: Button = client.buttons.get(i.customId);
        
        if (!button) {
            await i.followUp({ 
                content: `No button matching ${i.customId} was found.`, 
                ephemeral: true
            });
            return;
        }

        try {
            await button.execute(i);
        }
        catch (e) {
            console.error(e);
            await i.followUp({ 
                content: 'There was an error while executing this button.',
                ephemeral: true
            });            
        }
    }
});

client.login(process.env.TOKEN);
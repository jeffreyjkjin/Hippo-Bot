import { BaseInteraction } from 'discord.js'

import Command from '../structures/Command'
import Event from '../structures/Event'
import ExtendedClient from '../structures/ExtendedClient'

module.exports = new Event(
   'interactionCreate',
   false,
   async (i: BaseInteraction) => {
        if (i.isChatInputCommand()) {
            const client: ExtendedClient = i.client as ExtendedClient;
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
   }
);
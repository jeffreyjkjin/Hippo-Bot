import { BaseInteraction } from 'discord.js'

import Button from '../structures/Button'
import Event from '../structures/Event'
import ExtendedClient from '../structures/ExtendedClient'

module.exports = new Event(
   'interactionCreate',
   false,
   async (i: BaseInteraction) => {
        if (i.isButton()) {
            const client: ExtendedClient = i.client as ExtendedClient;
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
   }
);
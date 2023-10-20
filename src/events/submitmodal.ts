import { BaseInteraction } from 'discord.js'

import Event from '../structures/Event'
import ExtendedClient from '../structures/ExtendedClient'
import Modal from '../structures/Modal'

module.exports = new Event(
   'interactionCreate',
   false,
   async (i: BaseInteraction) => {
        if (i.isModalSubmit()) {
            const client: ExtendedClient = i.client as ExtendedClient;
            const modal: Modal = client.modals.get(i.customId);

            if (!modal) {
                await i.followUp({ 
                    content: `No modal matching ${i.customId} was found.`, 
                    ephemeral: true
                });
                return;
            }
    
            try {
                await modal.execute(i);
            }
            catch (e) {
                console.error(e);
                await i.followUp({ 
                    content: 'There was an error while executing this modal.',
                    ephemeral: true
                });            
            }
        }
   }
);
import { BaseInteraction, InteractionReplyOptions } from 'discord.js'

import messageEmbed from '../embeds/messageembed'
import Event from '../structures/Event'
import ExtendedClient from '../structures/ExtendedClient'
import Modal from '../structures/Modal'

module.exports = new Event(
   'interactionCreate',
   false,
   /*
         DESC: Handles interactions from modals.
          PRE: Modals have been loaded into client.
        PARAM: i - Interaction from modal submission.
         POST: Calls execute function of the modal.
   */
   async (i: BaseInteraction) => {
        if (i.isModalSubmit()) {
            const client: ExtendedClient = i.client as ExtendedClient;
            const modal: Modal = client.modals.get(i.customId);

            if (!modal) {
                await i.followUp(messageEmbed(
                    `No modal matching ${i.customId} was found.`
                ) as InteractionReplyOptions);
                return;
            }
    
            try {
                await modal.execute(i);
            }
            catch (e: any) {
                console.error(e);
                await i.followUp(messageEmbed(
                    'There was an error while executing this modal.'
                ) as InteractionReplyOptions);    
            }
        }
   }
);
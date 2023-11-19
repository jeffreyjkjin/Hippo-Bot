import { BaseInteraction, InteractionReplyOptions } from 'discord.js'

import messageEmbed from '../embeds/messageembed'
import Button from '../structures/Button'
import Event from '../structures/Event'
import ExtendedClient from '../structures/ExtendedClient'

module.exports = new Event(
   'interactionCreate',
   false,
   /*
         DESC: Handles interactions from button presses.
          PRE: Buttons have been loaded into client. 
        PARAM: i - Interaction from button.
         POST: Calls execute function of the button that was pressed.
   */
   async (i: BaseInteraction) => {
        if (i.isButton()) {
            const client: ExtendedClient = i.client as ExtendedClient;
            const button: Button = client.buttons.get(i.customId);
        
            if (!button) {
                await i.followUp(messageEmbed(
                    `No button matching ${i.customId} was found.`
                ) as InteractionReplyOptions);
                return;
            }
    
            try {
                await button.execute(i);
            }
            catch (e: any) {
                console.error(e);
                await i.followUp(messageEmbed(
                    'There was an error while executing this button.'
                ) as InteractionReplyOptions);
            }
        }
   }
);
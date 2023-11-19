import { BaseInteraction, InteractionReplyOptions } from 'discord.js'

import messageEmbed from '../embeds/messageembed'
import Command from '../structures/Command'
import Event from '../structures/Event'
import ExtendedClient from '../structures/ExtendedClient'

module.exports = new Event(
   'interactionCreate',
   false,
   /*
         DESC: Handles interactions from commands.
          PRE: Commands have been loaded into client.
        PARAM: i - Interaction from command submission.
         POST: Calls execute function of the command submitted.
   */
   async (i: BaseInteraction) => {
        if (i.isChatInputCommand()) {
            const client: ExtendedClient = i.client as ExtendedClient;
            const command: Command = client.commands.get(i.commandName);

            if (!command) {
                await i.followUp(messageEmbed(
                    `No command matching ${i.commandName} was found.`
                ) as InteractionReplyOptions);
                return;
            }
    
            try {
                await command.execute(i);
            } 
            catch (e: any) {
                console.error(e);
                await i.followUp(messageEmbed(
                    'There was an error while executing this command.'
                ) as InteractionReplyOptions);
            }
        }
   }
);
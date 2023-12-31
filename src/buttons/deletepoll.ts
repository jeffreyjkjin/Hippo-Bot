import { ButtonInteraction, ButtonStyle, InteractionUpdateOptions, Message, User } from "discord.js"
import { ButtonBuilder } from "@discordjs/builders"

import messageEmbed from "../embeds/messageembed"
import PollData from "../interfaces/PollData"
import Button from "../structures/Button"
import ExtendedClient from "../structures/ExtendedClient"

module.exports = new Button(
    new ButtonBuilder()
        .setCustomId('deletepoll')
        .setEmoji({ name: '🗑️' })
        .setStyle(ButtonStyle.Secondary),
    /*
         DESC: Deletes the associated poll. 
          PRE: The poll exists and is valid.
        PARAM: i - Interaction from button press.
         POST: The poll post is removed and it's poll is deleted from the database.
    */
   async (i: ButtonInteraction) => {
        const client: ExtendedClient = i.client as ExtendedClient;
        const messageUrl: string = i.message.embeds[0].description.split('(').at(-1).slice(0, -2);
        
        try {
            // get poll data
            const poll: PollData = await client.mongo.db('Polls').collection<PollData>(i.guildId).findOne({
                messageUrl: messageUrl
            });

            // fetch poll post and delete it
            const pollPost: Message = await i.channel.messages.fetch(messageUrl.split('/').at(-1));
            await i.channel.messages.delete(pollPost);

            await client.mongo.db('Polls').collection<PollData>(i.guildId).deleteOne(poll);
            
            await i.update(messageEmbed(`**${poll.title}** has been deleted.`) as InteractionUpdateOptions);
        }
        catch (e: any) {
            throw Error();
        }

    }
);
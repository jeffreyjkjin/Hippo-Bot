import { ButtonInteraction, ButtonStyle, InteractionUpdateOptions, Message } from "discord.js"
import { ButtonBuilder } from "@discordjs/builders"

import deleteEventEmbed from "../embeds/deleteeventembed"
import EventData from "../interfaces/EventData"
import Button from "../structures/Button"
import ExtendedClient from "../structures/ExtendedClient"

module.exports = new Button(
    new ButtonBuilder()
        .setCustomId('deleteevent')
        .setEmoji({ name: '🗑️' })
        .setStyle(ButtonStyle.Secondary),
    /*
         DESC: Deletes the associated event. 
          PRE: The event exists and is valid.
        PARAM: i - Interaction from button press.
         POST: The event post is removed and it's event is deleted from the database.
    */
    async (i: ButtonInteraction) => {
        try {
            // get event data
            const client: ExtendedClient = i.client as ExtendedClient;
            const messageUrl: string = i.message.embeds[0].description.split('(').at(-1).slice(0, -2);
            const event: EventData = await client.mongo.db(i.guildId).collection<EventData>('Events').findOne({
                messageUrl: messageUrl
            });

            // fetch event post and delete it
            const eventPost: Message = await i.channel.messages.fetch(messageUrl.split('/').at(-1));
            await i.channel.messages.delete(eventPost);
 
            await client.mongo.db(i.guildId).collection<EventData>('Events').deleteOne(event);
            
            await i.update(deleteEventEmbed(event) as InteractionUpdateOptions);
        }
        catch (e: any) {
            throw Error();
        }

    }
);
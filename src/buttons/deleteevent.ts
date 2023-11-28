import { ButtonInteraction, ButtonStyle, InteractionUpdateOptions, Message, User } from "discord.js"
import { ButtonBuilder } from "@discordjs/builders"

import deleteEventEmbed from "../embeds/deleteeventembed"
import messageEmbed from "../embeds/messageembed"
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
        const client: ExtendedClient = i.client as ExtendedClient;
        const messageUrl: string = i.message.embeds[0].description.split('(').at(-1).slice(0, -2);
        
        try {
            // get event data
            const event: EventData = await client.mongo.db('Events').collection<EventData>(i.guildId).findOne({
                messageUrl: messageUrl
            });

            // fetch event post and delete it
            const eventPost: Message = await i.channel.messages.fetch(messageUrl.split('/').at(-1));
            await i.channel.messages.delete(eventPost);
 
            await client.mongo.db(i.guildId).collection<EventData>('Events').deleteOne(event);
            
            await i.update(messageEmbed(`**${event.title}** has been deleted.`) as InteractionUpdateOptions);

            // dm attendees that event has been deleted
            event.attendees.forEach(async (id: string) => {
                const attendee: User = await client.users.fetch(id);
                await attendee.send(deleteEventEmbed(i, event));
            });
        }
        catch (e: any) {
            throw Error();
        }

    }
);
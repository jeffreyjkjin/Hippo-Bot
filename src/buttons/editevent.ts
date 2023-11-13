import dayjs from "dayjs"
import { ButtonInteraction, ButtonStyle } from "discord.js"
import { ButtonBuilder } from "@discordjs/builders"

import EventData from "../interfaces/EventData"
import Button from "../structures/Button"
import ExtendedClient from "../structures/ExtendedClient"
import eventModal from "../utils/eventmodal"

module.exports = new Button(
    new ButtonBuilder()
        .setCustomId('editevent')
        .setEmoji({ name: '📝' })
        .setStyle(ButtonStyle.Secondary),
    /*
         DESC: Allows user to edit an event.
          PRE: The event exists and is valid.
        PARAM: i - Interaction from button press.
         POST: The event is moved to the user's EditEvent collection and a modal to edit the event is displayed.
    */
    async (i: ButtonInteraction) => {
        const client: ExtendedClient = i.client as ExtendedClient;
        const messageUrl: string = i.message.embeds[0].description.split('(').at(-1).slice(0, -2);
        
        try {
            const event: EventData = await client.mongo.db('Events').collection<EventData>(i.guildId).findOne({
                messageUrl: messageUrl
            });

            // convert time to be readable
            event.datetime = dayjs(event.datetime, 'MMMM D YYYY h:mm A Z').toString();

            // only one event should be in each user's EditEvent collection
            if (await client.mongo.db('EditEvent').collection<EventData>(i.user.id).countDocuments() > 0) {
                await client.mongo.db('EditEvent').collection<EventData>(i.user.id).deleteMany({});
            }
            await client.mongo.db('EditEvent').collection(i.user.id).insertOne(event);
            
            await i.showModal(eventModal('editevent', event));
        }
        catch (e: any) {
            throw Error();
        }

    }
);
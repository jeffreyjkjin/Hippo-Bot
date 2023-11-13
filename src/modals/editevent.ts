import { InteractionReplyOptions, Message, MessageEditOptions, ModalSubmitInteraction } from 'discord.js'

import eventEmbed from '../embeds/eventembed'
import editEventEmbed from '../embeds/editeventembed'
import EventData from '../interfaces/EventData'
import ExtendedClient from '../structures/ExtendedClient'
import Modal from '../structures/Modal'
import eventModal from '../utils/eventmodal'
import parseDate from '../utils/parsedate'

module.exports = new Modal(
    eventModal('editevent'),
    /*
         DESC: Updates the event using the data gathered from the modal. 
          PRE: The event being edited is valid and exists.
        PARAM: i - Interaction from modal submission.
         POST: Both the events fields in the db and it's embed post are updated.
    */
    async (i: ModalSubmitInteraction) => {
        const client: ExtendedClient = i.client as ExtendedClient;

        const title: string = i.fields.getTextInputValue('title');
        const description: string = i.fields.getTextInputValue('description');
        const datetime: string = i.fields.getTextInputValue('datetime');
        const image: string = i.fields.getTextInputValue('image');

        try {
            const parsedDatetime: string = parseDate(datetime);

            // update event
            const event: EventData = await client.mongo.db('EditEvent').collection<EventData>(i.user.id).findOne({});
            await client.mongo.db('Events').collection<EventData>(i.guild.id).updateOne(
                { messageUrl: event.messageUrl },
                {
                    $set: {
                        title: title,
                        description: description,
                        datetime: parsedDatetime,
                        image: image
                    }
                }
            );

            // delete event from user's EditEvent collection
            await client.mongo.db('EditEvent').collection<EventData>(i.user.id).deleteMany({});

            // update event post
            const updatedEvent: EventData = await client.mongo.db('Events').collection<EventData>(i.guild.id).findOne(
                { messageUrl: event.messageUrl }
            );

            const eventPost: Message = await i.channel.messages.fetch(event.messageUrl.split('/').at(-1));
            await eventPost.edit(eventEmbed(i, updatedEvent) as MessageEditOptions);
            
            await i.reply(editEventEmbed(updatedEvent) as InteractionReplyOptions);
        }
        catch (e: any) {
            await i.reply({ 
                content: e.toString(), 
                ephemeral: true
            });
        }
    }
);
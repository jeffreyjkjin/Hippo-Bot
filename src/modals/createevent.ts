import { InteractionReplyOptions, InteractionResponse, ModalSubmitInteraction } from 'discord.js'

import eventEmbed from '../embeds/eventembed'
import EventData from '../interfaces/EventData'
import ExtendedClient from '../structures/ExtendedClient'
import Modal from '../structures/Modal'
import eventModal from '../utils/eventmodal'
import parseDate from '../utils/parsedate'

module.exports = new Modal(
    eventModal('createevent'),
    /*
         DESC: Creates an event using the details provided from the modal.
          PRE: The data from the modal is valid.
        PARAM: i - Interaction from modal submission.
         POST: Inserts event into db and creates an event embed for it.
    */
    async (i: ModalSubmitInteraction) => {
        const client: ExtendedClient = i.client as ExtendedClient;
        
        const event: EventData = {
            title: i.fields.getTextInputValue('title'),
            description: i.fields.getTextInputValue('description'),
            datetime: i.fields.getTextInputValue('datetime'),
            attendees: [] as string[],
            maybe: [] as string[],
            pass: [] as string[],
            image: i.fields.getTextInputValue('image'),
            messageUrl: null,
            channelId: i.channelId,
            creatorId: i.user.id,
            started: false
        }

        try {
            event.datetime = parseDate(event.datetime);

            const message: InteractionResponse = await i.reply(eventEmbed(i, event) as InteractionReplyOptions);
            event.messageUrl = (await message.fetch()).url;
            
            await client.mongo.db('Events').collection(i.guild.id).insertOne(event);
        }
        catch (e: any) {
            await i.reply({ 
                content: e.toString(), 
                ephemeral: true
            });
        }

    }
);
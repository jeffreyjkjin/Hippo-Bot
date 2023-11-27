import { InteractionReplyOptions, InteractionResponse, ModalSubmitInteraction } from 'discord.js'

import eventEmbed from '../embeds/eventembed'
import messageEmbed from '../embeds/messageembed'
import EventData from '../interfaces/EventData'
import ExtendedClient from '../structures/ExtendedClient'
import Modal from '../structures/Modal'
import checkImage from '../utils/checkimage'
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

        // check if time is valid
        try {
            event.datetime = parseDate(event.datetime);
        }
        catch (e: any) {
            await i.reply(messageEmbed(e.toString()) as InteractionReplyOptions);
            return;
        }

        // check if image is valid
        if (event.image) {
            try {
                checkImage(event.image);
            }
            catch (e: any) {
                i.reply(messageEmbed(e.toString()) as InteractionReplyOptions);
                return;
            }
        }

        // insert event into db and create event embed post
        try {
            const message: InteractionResponse = await i.reply(eventEmbed(i, event) as InteractionReplyOptions);
            event.messageUrl = (await message.fetch()).url;
            
            await client.mongo.db('Events').collection(i.guild.id).insertOne(event);
        }
        catch (e: any) {
            await i.reply(messageEmbed(
                'This event could not be created.'
            ) as InteractionReplyOptions);
        }

    }
);
import { InteractionResponse, ModalSubmitInteraction } from 'discord.js'

import eventEmbed from '../embeds/eventembed'
import EventData from '../interfaces/EventData'
import Modal from '../structures/Modal'
import createEventModal from '../utils/createeventmodal'
import insertEvent from '../utils/insertevent'
import parseDate from '../utils/parsedate'

module.exports = new Modal(
    createEventModal(),
    async (i: ModalSubmitInteraction) => {
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

            const message: InteractionResponse = await i.reply({ embeds: [eventEmbed(i, event)] });
            event.messageUrl = (await message.fetch()).url;
            
            await insertEvent(i, event);
        }
        catch (e) {
            await i.reply({ 
                content: e.toString().slice(7,), 
                ephemeral: true
            });
        }

    }
);
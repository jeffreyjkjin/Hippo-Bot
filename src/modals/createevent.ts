import { ModalSubmitInteraction } from 'discord.js'

import EventEmbed from '../embeds/eventembed'
import CreateEventModal from '../utils/createeventmodal'
import EventData from '../interfaces/EventData'
import Modal from '../structures/Modal'

module.exports = new Modal(
    CreateEventModal(),
    async (i: ModalSubmitInteraction) => {
        const event: EventData = {
            title: i.fields.getTextInputValue('title'),
            description: i.fields.getTextInputValue('description'),
            datetime: i.fields.getTextInputValue('datetime'),
            attendees: [] as string[],
            maybe: [] as string[],
            pass: [] as string[],
            image: i.fields.getTextInputValue('image'),
            creator: i.user.id
        }

        await i.reply({ embeds: [EventEmbed(i, event)] });
    }
);
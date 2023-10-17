import { ModalSubmitInteraction } from 'discord.js'

import EventEmbed from '../embeds/eventembed'
import EventData from '../interfaces/EventData'
import Modal from '../structures/Modal'
import createEventModal from '../utils/createeventmodal'
import insertEvent from '../utils/insertevent'
import parseDate from '../utils/parsedate'

module.exports = new Modal(
    createEventModal(),
    async (i: ModalSubmitInteraction) => {
        let datetime: string;
        try {
            datetime = parseDate(i.fields.getTextInputValue('datetime'));
        }
        catch (e) {
            await i.reply({ 
                content: e.toString().slice(7,), 
                ephemeral: true
            });
            return;
        }

        const event: EventData = {
            title: i.fields.getTextInputValue('title'),
            description: i.fields.getTextInputValue('description'),
            datetime: datetime,
            attendees: [] as string[],
            maybe: [] as string[],
            pass: [] as string[],
            image: i.fields.getTextInputValue('image'),
            creator: i.user.id
        }

        try {
            await insertEvent(i, event);
        }
        catch (e) {
            await i.reply({ 
                content: e.toString().slice(7,), 
                ephemeral: true
            });
            return;
        }

        await i.reply({ embeds: [EventEmbed(i, event)] });
    }
);
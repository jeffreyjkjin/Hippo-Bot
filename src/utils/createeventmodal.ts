import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js'

import EventData from '../interfaces/EventData'

const createEventModal = (event?: EventData): ModalBuilder => {
    const modal: ModalBuilder = new ModalBuilder()
        .setCustomId('createevent')
        .setTitle('Create an event!');

    const title: TextInputBuilder = new TextInputBuilder()
        .setCustomId('title')
        .setLabel('What is your event called?')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('My awesome event.')
        .setValue((event && event.title) || '')
        .setRequired(true);
        
    const datetime: TextInputBuilder = new TextInputBuilder()
        .setCustomId('datetime')
        .setLabel('When is your event?')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('October 2, 2023 10:00pm PST')
        .setValue((event && event.datetime) || '')
        .setRequired(true);
    
    const description: TextInputBuilder = new TextInputBuilder()
        .setCustomId('description')
        .setLabel('What is your event about?')
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder('An epic event for epic gamers.')
        .setValue((event && event.description) || '')
        .setRequired(false);
    
    const image: TextInputBuilder = new TextInputBuilder()
        .setCustomId('image')
        .setLabel('Add an image to your event.')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('https://i.imgur.com/w8as1S9.png')
        .setValue((event && event.image) || '')
        .setRequired(false);
    
    const titleRow: ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>()
        .addComponents(title);
    const datetimeRow: ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>()
        .addComponents(datetime);
    const descRow: ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>()
        .addComponents(description);
    const imageRow: ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>()
        .addComponents(image);
    
    modal.addComponents(titleRow, datetimeRow, descRow, imageRow);    

    return modal;
}

export default createEventModal;
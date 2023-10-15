import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js'

import EventData from '../interfaces/EventData'

const CreateEventModal = (event?: EventData): ModalBuilder => {
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
        
    const time: TextInputBuilder = new TextInputBuilder()
        .setCustomId('time')
        .setLabel('What time is your event at?')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('10:00pm PST')
        .setValue((event && event.time) || '')
        .setRequired(true);
        
    const date: TextInputBuilder = new TextInputBuilder()
        .setCustomId('date')
        .setLabel('What day is your event on?')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('October 2, 2023')
        .setValue((event && event.date) || '')
        .setRequired(false);
    
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
    const timeRow: ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>()
        .addComponents(time);
    const dateRow: ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>()
        .addComponents(date);
    const descRow: ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>()
        .addComponents(description);
    const imageRow: ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>()
        .addComponents(image);
    
    modal.addComponents(titleRow, timeRow, dateRow, descRow, imageRow);    

    return modal;
}

export default CreateEventModal;
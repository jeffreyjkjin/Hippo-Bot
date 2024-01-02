import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js'

import PollData from '../interfaces/PollData'

/*
     DESC: Generates a submission form to create/edit a poll.
      PRE: poll must be passed when using id = 'editpoll'.
    PARAM: id - A valid id of a modal.
           poll - A poll associated with the modal.
     POST: Calls appropriate modal submission event. 

*/
const pollModal = (id: string, poll?: PollData): ModalBuilder => {
    const modal: ModalBuilder = new ModalBuilder()
        .setCustomId(id)
        .setTitle((id === 'createpoll' && 'Create a poll!') || (id === 'editpoll' && 'Edit a poll!'))
    
    const title: TextInputBuilder = new TextInputBuilder()
        .setCustomId('title')
        .setLabel('What is your poll called?')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('My awesome poll.')
        .setValue((poll && poll.title) || '')
        .setMaxLength(256)
        .setRequired(true);
    
    const description: TextInputBuilder = new TextInputBuilder()
        .setCustomId('description')
        .setLabel('What is your poll about?')
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder('A poll for epic gamers.')
        .setValue((poll && poll.description) || '')
        .setMaxLength(1024)
        .setRequired(false);
    
    const image: TextInputBuilder = new TextInputBuilder()
        .setCustomId('image')
        .setLabel('Add an image to your poll.')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('https://i.imgur.com/w8as1S9.png')
        .setValue((poll && poll.image) || '')
        .setRequired(false);
    
    modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(title));
    
    if (id === 'createpoll' && poll) {
        // if user is creating a new poll
        const optionsRow: ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>()
            .addComponents(new TextInputBuilder()
                .setCustomId('options')
                .setLabel('What are the options for your poll?')
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder('Cats, Dogs, etc. You can have up to 15 options.')
                .setValue(poll.options ? poll.options.keys().next().value : '')
                .setMaxLength(3820)
                .setRequired(true)
            );
        modal.addComponents(optionsRow);
    }
    
    modal.addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(description),
        new ActionRowBuilder<TextInputBuilder>().addComponents(image)
    );    
    
    return modal;
}

export default pollModal;
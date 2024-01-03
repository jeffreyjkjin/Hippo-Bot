import { ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js'

import Button from '../structures/Button' 

module.exports = new Button(
    new ButtonBuilder()
        .setCustomId('addoptions')
        .setEmoji({ name: '➕' })
        .setStyle(ButtonStyle.Secondary),
    /*
         DESC: Allows the user to add options to the poll via modal.
          PRE: The poll exists and is valid; addOptions is set to true.
        PARAM: i - Interaction from button press.
         POST: Displays modal to add option.
    */
    async (i: ButtonInteraction) => {
        await i.showModal(require('../modals/addoption'));
    }
);
import { ActionRowBuilder, Colors, EmbedBuilder, MessageCreateOptions } from "discord.js"
import { ButtonBuilder } from "@discordjs/builders"

import EventData from "../interfaces/EventData"

/*
     DESC: Shows user some options to modify the event.
      PRE: The event is valid and hasn't started yet.
    PARAM: event - Data from the event being modified.
     POST: Returns embed.
*/
const eventSettingsEmbed = (event: EventData): MessageCreateOptions => {
    const embed: EmbedBuilder = new EmbedBuilder()
        .setTitle('**Event Settings**')
        .setColor(Colors.Green)
        .setDescription(`What would you like to do with [**${event.title}**](${event.messageUrl})?`)
        .setFooter({
            text: '📝 Edit  | 🗑️ Delete'
        });

    const buttons: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            require('../buttons/editevent'),
            require('../buttons/deleteevent')
        );

    return {
        embeds: [embed],
        components: [buttons],
        ephemeral: true
    } as MessageCreateOptions;
}

export default eventSettingsEmbed;
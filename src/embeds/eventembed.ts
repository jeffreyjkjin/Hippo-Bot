import { ActionRowBuilder, BaseInteraction, Colors, EmbedBuilder, MessageCreateOptions, userMention } from 'discord.js'
import { ButtonBuilder } from '@discordjs/builders'

import EventData from '../interfaces/EventData'

/*
     DESC: Creates formatted string of user mentions.
      PRE: All ids are valid.
    PARAM: ids - An array of Discord ids.
      POST: Returns formatted string.
*/
const printNames = (ids: string[]): string => {
    const names: string = ids.map((id: string): string => {
        return `> ${userMention(id)}`;
    }).toString().replaceAll(',', '\n');

    return names ? names : '> -';
}

/*
     DESC: Displays event information to user with interactive attendance buttons.
      PRE: The event is valid.
    PARAM: i - Generic interaction.
    PARAM: event - Data from the event.
     POST: Returns embed.
*/
const eventEmbed = (i: BaseInteraction, event: EventData): MessageCreateOptions => {
    const embed: EmbedBuilder = new EmbedBuilder()
        .setTitle(`:calendar_spiral: **${event.title}**`)
        .setColor(Colors.Green)
        .setDescription(event.description ? event.description : null)
        .addFields(
            { 
                name: 'Time', 
                value: `<t:${Date.parse(event.datetime)/1000}> (<t:${Date.parse(event.datetime)/1000}:R>)`
            },
            {
                name: `:white_check_mark: Attendees (${event.attendees.length})`,
                value: printNames(event.attendees),
                inline: true
            },
            {
                name: `:person_shrugging: Maybe (${event.maybe.length})`,
                value: printNames(event.maybe),
                inline: true
            },
            {
                name: `:x: Pass (${event.pass.length})`,
                value: printNames(event.pass),
                inline: true
            }
        )
        .setImage(event.image ? event.image : null)
        .setFooter({ text: `⚙️ Settings | Created by ${i.client.users.cache.get(event.creatorId).globalName}` });

    const buttons: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                require('../buttons/attend'), 
                require('../buttons/maybe'), 
                require('../buttons/pass'),
                require('../buttons/eventsettings')
            );

    return {
        embeds: [embed],
        components: [buttons]
    } as MessageCreateOptions;
}

export default eventEmbed;
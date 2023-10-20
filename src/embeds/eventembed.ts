import { BaseInteraction, EmbedBuilder, userMention } from 'discord.js'

import EventData from '../interfaces/EventData'

const eventEmbed = (i: BaseInteraction, event: EventData): EmbedBuilder => {
    return new EmbedBuilder()
        .setTitle(`:calendar_spiral: ${event.title}`)
        .setDescription(event.description ? event.description : null)
        .addFields(
            { 
                name: 'Time', 
                value: `<t:${Date.parse(event.datetime)/1000}> (<t:${Date.parse(event.datetime)/1000}:R>)`
            },
            {
                name: `:white_check_mark: Attendees (${event.attendees.length})`,
                value: event.attendees.length ? event.attendees.map(
                    (id): string => { 
                        return `> ${userMention(id)}`; 
                    }).toString().replaceAll(',', '\n') : '> -',
                inline: true
            },
            {
                name: `:person_shrugging: Maybe (${event.maybe.length})`,
                value: event.maybe.length ? event.maybe.map(
                    (id): string => {
                        return `> ${userMention(id)}`;
                    }).toString().replaceAll(',', '\n') : '> -',
                inline: true
            },
            {
                name: `:x: Pass (${event.pass.length})`,
                value: event.pass.length ? event.pass.map(
                    (id): string => { 
                        return `> ${userMention(id)}`;
                    }).toString().replaceAll(',', '\n') : '> -',
                inline: true
            }
        )
        .setImage(event.image ? event.image : null)
        .setFooter({ text: `Created by ${i.client.users.cache.get(event.creatorId).globalName}` });
}

export default eventEmbed;
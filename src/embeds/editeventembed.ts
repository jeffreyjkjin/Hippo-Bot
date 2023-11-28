import dayjs from "dayjs"
import { BaseInteraction, Colors, MessageCreateOptions } from "discord.js"
import { EmbedBuilder } from "@discordjs/builders"

import EventData from "../interfaces/EventData"

/*
     DESC: Displays a notification to attendees informing them that the event has been edited.
      PRE: The event is valid and exists.
    PARAM: i - Generic interaction.
           oldEvent - The event before it was edited.
           newEvent - The event after it was edited.
     POST: Returns embed.
*/
const editEventEmbed = (i: BaseInteraction, oldEvent: EventData, newEvent: EventData): MessageCreateOptions => {
    const embed: EmbedBuilder = new EmbedBuilder()
        .setTitle('📝 Event Edited')
        .setColor(Colors.Green)
        .setDescription(
            `An event you have signed up for, [**${oldEvent.title}**](${oldEvent.messageUrl}), has 
            been edited by *${i.user.displayName}*.`
        );

    // add field if event field was updated
    if (oldEvent.title != newEvent.title) {
        embed.addFields({
            name: '🆕 Event Title',
            value: newEvent.title
        });
    }
    if (dayjs(oldEvent.datetime).diff(dayjs(newEvent.datetime))) {
        embed.addFields({
            name: '🆕 Event Time',
            value:`<t:${Date.parse(newEvent.datetime)/1000}> (<t:${Date.parse(newEvent.datetime)/1000}:R>)`
        });
    }
    if (oldEvent.description != newEvent.description) {
        embed.addFields({
            name: '🆕 Event Description',
            value: newEvent.description ? newEvent.description.substring(0, 1024) : ''
        });
    }

    return {
        embeds: [embed]
    } as MessageCreateOptions;
}

export default editEventEmbed;
import { Colors, MessageCreateOptions } from "discord.js"
import { EmbedBuilder } from "@discordjs/builders"

import EventData from "../interfaces/EventData"

/*
     DESC: Displays a confirmation to user that they've joined the attendee list for the event.
      PRE: Event is valid and exists.
    PARAM: event - The event the user has joined.
     POST: Returns embed.
*/
const attendEmbed = (event: EventData): MessageCreateOptions => {
    const embed: EmbedBuilder = new EmbedBuilder()
        .setTitle('**Attendee Confirmation**')
        .setColor(Colors.Green)
        .setDescription(
            `You have joined the :white_check_mark: __Attendees__ list for [**${event.title}**](${event.messageUrl})!`
        )
        .addFields(
            {
                name: 'Event Time',
                value: `<t:${Date.parse(event.datetime)/1000}> (<t:${Date.parse(event.datetime)/1000}:R>)`
            }
        );

    return {
        embeds: [embed]
    } as MessageCreateOptions;
}

export default attendEmbed;
import { MessageCreateOptions } from "discord.js"
import { EmbedBuilder } from "@discordjs/builders"

import EventData from "../interfaces/EventData"

const attendEmbed = (event: EventData): MessageCreateOptions => {
    const embed: EmbedBuilder = new EmbedBuilder()
        .setTitle('**Attendee Confirmation**')
        .setDescription(`You have joined the :white_check_mark: __Attendees__ list for [**${event.title}**](${event.messageUrl})!`)
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
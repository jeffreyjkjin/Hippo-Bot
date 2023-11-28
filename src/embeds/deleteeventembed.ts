import { BaseInteraction, Colors, MessageCreateOptions } from "discord.js"
import { EmbedBuilder } from "@discordjs/builders"

import EventData from "../interfaces/EventData"

/*
     DESC: Displays a message indicating the associated event was deleted.
      PRE: The event is valid and exists.
    PARAM: i - Generic interaction.
           event - The event that was deleted.
     POST: Returns embed.
*/
const deleteEventEmbed = (i: BaseInteraction, event: EventData): MessageCreateOptions => {
    const embed: EmbedBuilder = new EmbedBuilder()
        .setTitle('🗑️ Event Deleted')
        .setColor(Colors.Green)
        .setDescription(
            `An event you have signed up for, **${event.title}**, has been deleted by 
            *${i.user.displayName}*.`
        );

    return {
        embeds: [embed]
    } as MessageCreateOptions;
}

export default deleteEventEmbed;
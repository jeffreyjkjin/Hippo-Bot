import { Colors, MessageCreateOptions } from "discord.js"
import { EmbedBuilder } from "@discordjs/builders"

import EventData from "../interfaces/EventData"

/*
     DESC: Shows user that the associated event has been deleted.
      PRE: The event has been successfully deleted.
    PARAM: event - Data from event that was deleted.
     POST: Returns embed.  
*/
const deleteEventEmbed = (event: EventData): MessageCreateOptions => {
    const embed: EmbedBuilder = new EmbedBuilder()
        .setColor(Colors.Green)
        .setDescription(`**${event.title}** has been deleted.`);

    return {
        embeds: [embed],
        components: [],
        ephemeral: true
    } as MessageCreateOptions;
}

export default deleteEventEmbed;
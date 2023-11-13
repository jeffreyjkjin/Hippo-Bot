import { Colors, MessageCreateOptions } from "discord.js"
import { EmbedBuilder } from "@discordjs/builders"

import EventData from "../interfaces/EventData"

/*
     DESC: Shows user that the associated event has been edited.
      PRE: The event has been successfully edited.
    PARAM: event - Data from event that was edited.
     POST: Returns embed.  
*/
const editEventEmbed = (event: EventData): MessageCreateOptions => {
    const embed: EmbedBuilder = new EmbedBuilder()
        .setColor(Colors.Green)
        .setDescription(`[**${event.title}**](${event.messageUrl}) has been edited.`);

    return {
        embeds: [embed],
        components: [],
        ephemeral: true
    } as MessageCreateOptions;
}

export default editEventEmbed;
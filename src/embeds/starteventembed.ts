import { EmbedBuilder, MessageCreateOptions, userMention } from "discord.js"

import EventData from "../interfaces/EventData"

const startEventEmbed = (event: EventData): MessageCreateOptions => {
    const embed: EmbedBuilder = new EmbedBuilder()
        .setTitle(`**${event.title}** is started now!`)
        .setDescription(`[Event Details](${event.messageUrl})`);

    const attendees: string = event.attendees.map((id: string): string => {
        return userMention(id);
    }).toString();
    
    return { 
        content: attendees,
        embeds: [embed]
    } as MessageCreateOptions;
}

export default startEventEmbed;
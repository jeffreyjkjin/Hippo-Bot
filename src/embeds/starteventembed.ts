import { Colors, EmbedBuilder, MessageCreateOptions, userMention } from "discord.js"

import EventData from "../interfaces/EventData"

/*
     DESC: Displays embed informing user the event has begun.
      PRE: The event is valid and has started.
    PARAM: event - Data from the event that has started.
     POST: Returns embed.
*/
const startEventEmbed = (event: EventData): MessageCreateOptions => {
    const embed: EmbedBuilder = new EmbedBuilder()
        .setTitle(`**${event.title}** is starting now!`)
        .setColor(Colors.Green)
        .setDescription(`[Event Details](${event.messageUrl})`);

    let attendees: string = '';
    event.attendees.map((id: string) => {
        const user: string = userMention(id);
        // list of attendees must be shorter than discord message limit
        if (attendees.length + user.length <= 2000) {
            attendees += user;
        }
    });
    
    return { 
        content: attendees,
        embeds: [embed]
    } as MessageCreateOptions;
}

export default startEventEmbed;
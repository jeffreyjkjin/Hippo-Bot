import { Colors, EmbedBuilder, MessageCreateOptions, quote } from 'discord.js'

import EventData from '../interfaces/EventData'

/*
     DESC: Generates an embed that displays all of the servers current scheduled events.
      PRE: Events in the events array exist and are valid.
    PARAM: events - An array of every scheduled event for the server.
     POST: Returns embed.
*/
const listEventsEmbed = (events: EventData[]): MessageCreateOptions => {
    // sort the list of events by earliest scheduled datetime
    events = events.sort((a: EventData, b: EventData): number => {
        return Date.parse(a.datetime) - Date.parse(b.datetime);
    });
    
    let eventList: string = `Displaying all scheduled events on this server as of <t:${Date.parse(Date())/1000}>.\n`;
    let eventsDisplayed: number = 0;

    events.forEach((event: EventData) => {
        const eventString: string = quote(`<t:${Date.parse(event.datetime)/1000}> [**${event.title}**](${event.messageUrl}) (<t:${Date.parse(event.datetime)/1000}:R>)\n`);
       
        // check if eventList string is too long for embed
        if (eventList.length + eventString.length > 4096) {
            return;
        }

        eventList += eventString;
        eventsDisplayed++;
    });
    
    // check if all events are able to be shown in the embed
    const eventsAllDisplayed: string = (events.length !== eventsDisplayed) ? `(${eventsDisplayed} events are currently shown.)` : '';

    const embed: EmbedBuilder = new EmbedBuilder()
        .setTitle('📃 Event Listings')
        .setColor(Colors.Green)
        .setDescription(eventList)
        .setFooter({
            text: `There are currently ${events.length} events scheduled on this server. ${eventsAllDisplayed}`
        });

    return {
        ephemeral: true,
        embeds: [embed]
    } as MessageCreateOptions;
}

export default listEventsEmbed;
import { EmbedBuilder } from "discord.js"

import EventData from "../interfaces/EventData"

const startEventEmbed = (event: EventData) => {
    return new EmbedBuilder()
        .setTitle(`${event.title} is started now!`)
        .setDescription(`[Event Details](${event.messageUrl})`);
}

export default startEventEmbed;
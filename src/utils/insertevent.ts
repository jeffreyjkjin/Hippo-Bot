import { BaseInteraction } from "discord.js"

import EventData from "../interfaces/EventData"
import ExtendedClient from "../structures/ExtendedClient"

const insertEvent = async (i: BaseInteraction, event: EventData) => {
    try {
        const client: ExtendedClient = i.client as ExtendedClient;

        await client.mongo.db(i.guildId).collection('Events').insertOne(event);
    }
    catch (e: any) {
        throw 'This event could not be created.';
    }
}

export default insertEvent;
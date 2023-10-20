import EventData from '../interfaces/EventData'
import ExtendedClient from '../structures/ExtendedClient'

const updateEvent = async (client: ExtendedClient, guildId: string, event: EventData) => {
    try {
        await client.mongo.db(guildId).collection('Events').replaceOne(
            { messageUrl: event.messageUrl },
            event);
    }
    catch (e: any) {
        throw Error('This event could not be updated');
    }
}

export default updateEvent;
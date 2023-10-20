import EventData from "../interfaces/EventData"

const insertEvent = async (i: any, event: EventData) => {
    try {
        await i.client.mongo.db(i.guildId).collection('Events').insertOne(event);
    }
    catch (e: any) {
        throw Error('This event could not be created.');
    }
}

export default insertEvent;
import dayjs from 'dayjs'
import { Channel, userMention } from 'discord.js'

import startEventEmbed from '../embeds/starteventembed'
import EventData from '../interfaces/EventData'
import Event from '../structures/Event'
import ExtendedClient from '../structures/ExtendedClient'
import updateEvent from '../utils/updateevent'

module.exports = new Event(
    'ready',
    false,
    async (client: ExtendedClient) => {
        setInterval(async () => {
            client.guilds.cache.each(async (guild) => {
                const events: EventData[] = await client.mongo.db(guild.id).collection<EventData>('Events').find({
                    datetime: dayjs().second(0).millisecond(0).toISOString()
                }).toArray();

                events.forEach(async (event: EventData) => {
                    if (event.started) {
                        return;
                    }

                    let channel: Channel;
                    try {
                        channel = await guild.channels.fetch(event.channelId);
                    }
                    catch (e: any) {
                        channel = guild.systemChannel;
                    }

                    if (channel.isTextBased()) {
                        await channel.send(startEventEmbed(event));
                    }

                    try {
                        event.started = true;
                        await updateEvent(client, guild.id, event);
                    }
                    catch (e: any) {
                        console.log(e);
                    }
                });

            });
        }, 60000);
    }
);
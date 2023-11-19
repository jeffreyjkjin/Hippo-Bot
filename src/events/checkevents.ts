import dayjs from 'dayjs'
import { Guild, TextChannel } from 'discord.js'

import startEventEmbed from '../embeds/starteventembed'
import EventData from '../interfaces/EventData'
import Event from '../structures/Event'
import ExtendedClient from '../structures/ExtendedClient'

module.exports = new Event(
    'ready',
    false,
    /*
         DESC: Checks for events that have started every 60 seconds.
          PRE: The events in the database are valid.
        PARAM: client - Client from bot.
         POST: If an event has started, post a starting announcement and update event to be started.
    */
    async (client: ExtendedClient) => {
        setInterval(async () => {
            // loops through every guild that the bot is in
            client.guilds.cache.each(async (guild: Guild) => {
                // finds events that have started at the current time
                const events: EventData[] = await client.mongo.db('Events').collection<EventData>(guild.id).find({
                    datetime: dayjs().second(0).millisecond(0).toISOString(),
                    started: false
                }).toArray();

                events.forEach(async (event: EventData) => {
                    // send event start post
                    let channel: TextChannel;
                    try {
                        channel = await guild.channels.fetch(event.channelId) as TextChannel;
                    }
                    catch (e: any) {
                        channel = guild.systemChannel;
                    }
                    await channel.send(startEventEmbed(event));

                    try {
                        await client.mongo.db('Events').collection<EventData>(guild.id).updateOne(
                            { messageUrl: event.messageUrl },
                            {
                                $set: { started: true }
                            }
                        );
                    }
                    catch (e: any) {
                        console.log(e);
                    }
                });

            });
        }, 10000);
    }
);
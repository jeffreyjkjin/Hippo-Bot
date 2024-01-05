import dayjs from 'dayjs'
import { Guild, User } from 'discord.js'

import ReminderData from '../interfaces/ReminderData'
import reminderStartEmbed from '../embeds/reminderstartembed'
import Event from '../structures/Event'
import ExtendedClient from '../structures/ExtendedClient'

module.exports = new Event(
    'ready',
    false,
    /*
         DESC: Checks for reminders that have started every 10 seconds.
          PRE: The reminders in the database are valid.
        PARAM: client - Client from bot.
         POST: If an reminder has started, send the subscribers a reminder message.
    */
    async (client: ExtendedClient) => {
        setInterval(async () => {
            // loops through every guild that the bot is in
            client.guilds.cache.each(async (guild: Guild) => {
                // finds events that have started at the current time
                const reminders: ReminderData[] = await client.mongo.db('Reminders').collection<ReminderData>(guild.id).find({
                    datetime: dayjs().second(0).millisecond(0).toISOString(),
                    reminded: false
                }).toArray();

                reminders.forEach(async (reminder: ReminderData) => {
                    // update reminded status for reminder
                    try {
                        await client.mongo.db('Reminders').collection<ReminderData>(guild.id).updateOne(
                            { messageUrl: reminder.messageUrl },
                            {
                                $set: { reminded: true }
                            }
                        );
                    }
                    catch (e: any) {
                        console.log(e);
                    }

                    // send each subscriber a reminder in direct messages
                    reminder.subscribers.forEach(async (id: string) => {
                        try {
                            const user: User = await client.users.fetch(id); 
                            await user.send(reminderStartEmbed(reminder));
                        }
                        catch (e: any) {
                            console.log(e);
                        }
                    });
                });

            });
        }, 10000);
    }
);
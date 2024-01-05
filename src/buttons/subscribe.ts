import { ButtonInteraction, ButtonStyle, Interaction, InteractionReplyOptions } from 'discord.js'
import { ButtonBuilder } from '@discordjs/builders'

import messageEmbed from '../embeds/messageembed'
import subscribeReminderEmbed from '../embeds/subscribereminderembed'
import ReminderData from '../interfaces/ReminderData'
import Button from '../structures/Button'
import ExtendedClient from '../structures/ExtendedClient'

module.exports = new Button(
    new ButtonBuilder()
        .setCustomId('subscribe')
        .setEmoji({ name: '🔔'})
        .setStyle(ButtonStyle.Secondary),
    /*
         DESC: Allows users to subscribe to a reminder.
          PRE: The reminder exists and is valid.
        PARAM: i - Interaction from button.
         POST: Adds user to subscriber list for the reminder and sends them a confirmation.
    */
    async (i: ButtonInteraction) => {
        try {
            // fetch reminder
            const client: ExtendedClient = i.client as ExtendedClient;

            const reminder: ReminderData = await client.mongo.db('Reminders').collection<ReminderData>(i.guild.id).findOne({
                messageUrl: i.message.url 
            });


            if (reminder.reminded) {
                // if reminder has already happened
                await i.reply(messageEmbed(
                    'You cannot subscribe to a reminder that has already happened.'   
                ) as InteractionReplyOptions);
                
                return;
            }
            else if (reminder.subscribers.includes(i.user.id)) {
                // remover user from subscribers if they have already subscribed
                await client.mongo.db('Reminders').collection<ReminderData>(i.guild.id).updateOne(
                    { messageUrl: i.message.url },
                    {
                        $pull: { subscribers: i.user.id }
                    }
                );

                await i.reply(messageEmbed(
                    'You have unsubscribed from this reminder.'
                ) as InteractionReplyOptions);

                return;
            }
            else {
                // add user to subscribers
                await client.mongo.db('Reminders').collection<ReminderData>(i.guild.id).updateOne(
                    { messageUrl: i.message.url },
                    {
                        $push: { subscribers: i.user.id }
                    }
                );
                
                // dm user with reminder confirmation
                await i.user.send(subscribeReminderEmbed(reminder));

                await i.update({});
            }
        }
        catch (e: any) {
            throw Error();
        }
    }
);
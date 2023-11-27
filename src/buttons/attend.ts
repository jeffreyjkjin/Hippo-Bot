import { ButtonInteraction, ButtonStyle, InteractionReplyOptions, InteractionUpdateOptions } from 'discord.js'
import { ButtonBuilder } from '@discordjs/builders'

import attendEmbed from '../embeds/attendembed'
import eventEmbed from '../embeds/eventembed'
import messageEmbed from '../embeds/messageembed'
import EventData from '../interfaces/EventData'
import Button from '../structures/Button'
import ExtendedClient from '../structures/ExtendedClient'

module.exports = new Button(
    new ButtonBuilder()
        .setCustomId('attend')
        .setEmoji({ name: '✅'})
        .setStyle(ButtonStyle.Secondary),
    /*
         DESC: Allow user to 'attend' the event.
          PRE: The event exists and is valid.
        PARAM: i - Interaction from button.
         POST: Adds user to attendee list in event db, updates event embed, dms user with confirmation.
    */
    async (i: ButtonInteraction) => {
        try {
            // fetch event
            const client: ExtendedClient = i.client as ExtendedClient;

            const event: EventData = await client.mongo.db('Events').collection<EventData>(i.guild.id).findOne({
                messageUrl: i.message.url 
            });

            // check if event has started
            if (event.started) {
                i.reply(messageEmbed('You cannot attend an event that has already started.') as InteractionReplyOptions);
                return;
            }

            // remove user from attendees if they're already in it
            if (event.attendees.includes(i.user.id)) {
                await client.mongo.db('Events').collection<EventData>(i.guild.id).updateOne(
                    { messageUrl: i.message.url },
                    {
                        $pull: { attendees: i.user.id }
                    }
                );
            }
            else {
                // move user to attendees
                await client.mongo.db('Events').collection<EventData>(i.guild.id).updateOne(
                    { messageUrl: i.message.url },
                    {
                        $push: { 
                            attendees: i.user.id 
                        },
                        $pull: {
                            maybe: i.user.id,
                            pass: i.user.id
                        }
                    }
                );
                
                // dm user with event confirmation
                await i.user.send(attendEmbed(event));
            }
            
            // fetch updated event and update the event post
            const updatedEvent: EventData = await client.mongo.db('Events').collection<EventData>(i.guild.id).findOne({
                messageUrl: i.message.url 
            });
            await i.update(eventEmbed(i, updatedEvent) as InteractionUpdateOptions);
        }
        catch (e: any) {
            throw Error();
        }
    }
);
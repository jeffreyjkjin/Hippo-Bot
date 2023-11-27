import { ButtonInteraction, ButtonStyle, InteractionReplyOptions, InteractionUpdateOptions } from 'discord.js'
import { ButtonBuilder } from '@discordjs/builders'

import eventEmbed from '../embeds/eventembed'
import messageEmbed from '../embeds/messageembed'
import EventData from '../interfaces/EventData'
import Button from '../structures/Button'
import ExtendedClient from '../structures/ExtendedClient'

module.exports = new Button(
    new ButtonBuilder()
        .setCustomId('maybe')
        .setEmoji({ name: '🤷' })
        .setStyle(ButtonStyle.Secondary),
    /*
         DESC: Allows user to join 'maybe' list for the event.
          PRE: The event is valid and exists.
        PARAM: i - Interaction from button.
         POST: Adds user to maybe list in event db and updates event embed.
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
                i.reply(messageEmbed(
                    'You cannot join the maybe list for an event that has already started.'
                ) as InteractionReplyOptions);
                return;
            }

            // remove user from maybe list if they're already in it
            if (event.maybe.includes(i.user.id)) {
                await client.mongo.db('Events').collection<EventData>(i.guild.id).updateOne(
                    { messageUrl: i.message.url },
                    {
                        $pull: { maybe: i.user.id }
                    }
                );
            }
            else {
                // move user to maybe
                await client.mongo.db('Events').collection<EventData>(i.guild.id).updateOne(
                    { messageUrl: i.message.url },
                    {
                        $push: { 
                            maybe: i.user.id 
                        },
                        $pull: {
                            attendees: i.user.id,
                            pass: i.user.id
                        }
                    }
                );
            }

            // fetch updated event and update event post
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
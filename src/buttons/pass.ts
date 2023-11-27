import { ButtonInteraction, ButtonStyle, InteractionReplyOptions, InteractionUpdateOptions } from 'discord.js'
import { ButtonBuilder } from '@discordjs/builders'

import eventEmbed from '../embeds/eventembed'
import messageEmbed from '../embeds/messageembed'
import EventData from '../interfaces/EventData'
import Button from '../structures/Button'
import ExtendedClient from '../structures/ExtendedClient'

module.exports = new Button(
    new ButtonBuilder()
        .setCustomId('pass')
        .setEmoji({ name: '❌'})
        .setStyle(ButtonStyle.Secondary),
    /*
         DESC: Allows user to join 'pass' list for the event.
          PRE: The event must be valid and exist.
        PARAM: i - Interaction from button.
         POST: Adds user to the pass list in the event db and updates the event post.
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
                i.reply(messageEmbed('You cannot pass an event that has already started.') as InteractionReplyOptions);
                return;
            }

            // remove user from pass list if they're already on it
            if (event.pass.includes(i.user.id)) {
                await client.mongo.db('Events').collection<EventData>(i.guild.id).updateOne(
                    { messageUrl: i.message.url },
                    {
                        $pull: { pass: i.user.id }
                    }
                );                
            }
            else {
                // move user to pass
                await client.mongo.db('Events').collection<EventData>(i.guild.id).updateOne(
                    { messageUrl: i.message.url },
                    {
                        $push: { 
                            pass: i.user.id 
                        },
                        $pull: {
                            maybe: i.user.id,
                            attendees: i.user.id
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
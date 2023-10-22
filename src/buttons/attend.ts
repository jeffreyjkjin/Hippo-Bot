import { ButtonInteraction, ButtonStyle, InteractionUpdateOptions } from 'discord.js'
import { ButtonBuilder } from '@discordjs/builders'

import attendEmbed from '../embeds/attendembed'
import eventEmbed from '../embeds/eventembed'
import EventData from '../interfaces/EventData'
import Button from '../structures/Button'
import ExtendedClient from '../structures/ExtendedClient'
import updateEvent from '../utils/updateevent'

module.exports = new Button(
    new ButtonBuilder()
        .setCustomId('attend')
        .setEmoji({ name: '✅'})
        .setStyle(ButtonStyle.Secondary),
    async (i: ButtonInteraction) => {
        try {
            const client: ExtendedClient = i.client as ExtendedClient;

            const event: EventData = await client.mongo.db(i.guildId).collection<EventData>('Events').findOne({
                messageUrl: i.message.url 
            });

            if (event.started) {
                i.update({});
                return;
            }

            if (!event.attendees.includes(i.user.id)) {
                event.maybe = event.maybe.filter((id: string): boolean => {
                    return id !== i.user.id;
                });
    
                event.pass = event.pass.filter((id: string): boolean => {
                    return id !== i.user.id;
                });
                
                event.attendees.push(i.user.id);
            }
            else {
                event.attendees.filter((id: string): boolean => {
                    return id !== i.user.id;
                });
            }

            await updateEvent(client, i.guildId, event);
            await i.update(eventEmbed(i, event) as InteractionUpdateOptions);
            await i.user.send(attendEmbed(event));
        }
        catch (e: any) {
            throw Error();
        }
    }
);
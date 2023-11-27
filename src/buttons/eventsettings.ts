import { ButtonInteraction, ButtonStyle, InteractionReplyOptions, PermissionsBitField } from "discord.js"
import { ButtonBuilder } from "@discordjs/builders"

import eventSettingsEmbed from "../embeds/eventsettingsembed"
import messageEmbed from "../embeds/messageembed"
import EventData from "../interfaces/EventData"
import Button from "../structures/Button"
import ExtendedClient from "../structures/ExtendedClient"

module.exports = new Button(
    new ButtonBuilder()
        .setCustomId('eventSettings')
        .setEmoji({ name: '⚙️' })
        .setStyle(ButtonStyle.Secondary),
    async (i: ButtonInteraction) => {
        try {
            const client: ExtendedClient = i.client as ExtendedClient;
            
            const event: EventData = await client.mongo.db('Events').collection<EventData>(i.guildId).findOne({
                messageUrl: i.message.url 
            });

            // only let event creator or admins to modify event
            if (i.user.id != event.creatorId && !i.memberPermissions.has(PermissionsBitField.Flags.Administrator)) {
                await i.reply(messageEmbed('You do not have permission to edit this event.') as InteractionReplyOptions)
                return;
            }
            
            // check if event started
            if (event.started) {
                await i.reply(messageEmbed('You cannot edit an event that has started.') as InteractionReplyOptions);
                return;
            }

            await i.reply(eventSettingsEmbed(event) as InteractionReplyOptions);
        }
        catch (e: any) {
            throw Error();
        }
    }
);
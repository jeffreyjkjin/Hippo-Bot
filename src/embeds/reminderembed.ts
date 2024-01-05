import { ActionRowBuilder, BaseInteraction, ButtonBuilder, Colors, MessageCreateOptions } from 'discord.js'
import { EmbedBuilder } from '@discordjs/builders'

import ReminderData from '../interfaces/ReminderData'

/*
     DESC: Generates a reminder embed and allows users to subscribe to it.
      PRE: The reminder exists and is valid.
    PARAM: i - Generic interaction.
           reminder - The associated reminder data.
     POST: Returns embed.
*/
const reminderEmbed = (i: BaseInteraction, reminder: ReminderData): MessageCreateOptions => {
    const embed: EmbedBuilder = new EmbedBuilder()
        .setColor(Colors.Green)
        .setDescription(`Reminder ${reminder.title} set for <t:${Date.parse(reminder.datetime)/1000}:R>.`)
        .setFooter({ text: `🔔 Subscribe to reminder | Created by ${i.client.users.cache.get(reminder.creatorId).globalName}` });
    
    const button: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>();

    return {
        embeds: [embed],
        components: [button]
    } as MessageCreateOptions;
}

export default reminderEmbed;
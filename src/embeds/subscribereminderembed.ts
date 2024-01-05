import { Colors, MessageCreateOptions } from 'discord.js'
import { EmbedBuilder } from '@discordjs/builders'

import ReminderData from '../interfaces/ReminderData'

/*
     DESC: Generates a confirmation embed for subscribing to a reminder.
      PRE: The reminder exists and is valid.
    PARAM: reminder - The associated reminder data.
     POST: Returns embed.
*/
const subscribeReminderEmbed = (reminder: ReminderData): MessageCreateOptions => {
    const embed: EmbedBuilder = new EmbedBuilder()
        .setTitle('🔔 Reminder Confirmation')
        .setColor(Colors.Green)
        .setDescription(
            `You will be reminded on <t:${Date.parse(reminder.datetime)/1000}> (<t:${Date.parse(reminder.datetime)/1000}:R>) of [**${reminder.title}**](${reminder.messageUrl}).`
        );

    return {
        embeds: [embed]
    } as MessageCreateOptions;
}

export default subscribeReminderEmbed;
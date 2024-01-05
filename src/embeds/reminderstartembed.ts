import { EmbedBuilder, MessageCreateOptions } from 'discord.js'

import ReminderData from '../interfaces/ReminderData'

/*
     DESC: A reminder message to subscribers.
      PRE: The reminder exists and is valid.
    PARAM: reminder - The associated reminder.
     POST: Returns embed.
*/
const reminderStartEmbed = (reminder: ReminderData): MessageCreateOptions => {
    const embed: EmbedBuilder = new EmbedBuilder()
        .setTitle('🔔 Reminder')
        .setDescription(`[**${reminder.title}**](${reminder.messageUrl})`);

    return {
        embeds: [embed]
    } as MessageCreateOptions;
}

export default reminderStartEmbed;
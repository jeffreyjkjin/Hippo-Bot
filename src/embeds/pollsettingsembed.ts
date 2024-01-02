import { ActionRowBuilder, Colors, EmbedBuilder, MessageCreateOptions } from "discord.js"
import { ButtonBuilder } from "@discordjs/builders"

import PollData from "../interfaces/PollData"

/*
     DESC: Shows user some options to modify the poll.
      PRE: The poll is valid and hasn't ended.
    PARAM: poll - Data from the poll being modified.
     POST: Returns embed.
*/
const pollSettingsEmbed = (poll: PollData): MessageCreateOptions => {
    const embed: EmbedBuilder = new EmbedBuilder()
        .setTitle('**Poll Settings**')
        .setColor(Colors.Green)
        .setDescription(`What would you like to do with [**${poll.title}**](${poll.messageUrl})?`)
        .addFields(
            {
                name: `Single Vote ${'`' + (poll.singleVote ? 'Enabled`' : 'Disabled`')}`,
                value: 'Can voters vote for more than one option?'
            },
            {
                name: `Add Options ${'`' + (poll.addOptions ? 'Enabled`' : 'Disabled`')}`,
                value: 'Can users add other options to this poll?'
            }
        )
        .setFooter({
            text: '📝 Edit | 🗳️ Single Vote | ➕ Add Options | 🏁 End Poll | 🗑️ Delete'
        });

    const buttons: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            require('../buttons/editpoll'),
            require('../buttons/singlevote'),
            require('../buttons/endpoll'),
            require('../buttons/toggleaddoptions'),
            require('../buttons/deletepoll')
        );

    return {
        embeds: [embed],
        components: [buttons],
        ephemeral: true
    } as MessageCreateOptions;
}

export default pollSettingsEmbed;
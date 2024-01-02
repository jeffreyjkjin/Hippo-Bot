import { ButtonInteraction, ButtonStyle, InteractionReplyOptions, PermissionsBitField } from "discord.js"
import { ButtonBuilder } from "@discordjs/builders"

import messageEmbed from "../embeds/messageembed"
import pollSettingsEmbed from "../embeds/pollsettingsembed"
import PollData from "../interfaces/PollData"
import Button from "../structures/Button"
import ExtendedClient from "../structures/ExtendedClient"

module.exports = new Button(
    new ButtonBuilder()
        .setCustomId('pollsettings')
        .setEmoji({ name: '⚙️' })
        .setStyle(ButtonStyle.Secondary),
    /*
         DESC: Displays poll settings menu to user.
          PRE: The poll exists and is valid.
        PARAM: i - Generic interaction from button.
         POST: Returns embed.
    */
    async (i: ButtonInteraction) => {
        try {
            const client: ExtendedClient = i.client as ExtendedClient;
            
            const poll: PollData = await client.mongo.db('Polls').collection<PollData>(i.guildId).findOne({
                messageUrl: i.message.url 
            });

            // only let poll creator or admins to modify poll
            if (i.user.id != poll.creatorId && !i.memberPermissions.has(PermissionsBitField.Flags.Administrator)) {
                await i.reply(messageEmbed('You do not have permission to edit this poll.') as InteractionReplyOptions)
                return;
            }
            
            await i.reply(pollSettingsEmbed(poll) as InteractionReplyOptions);
        }
        catch (e: any) {
            throw Error();
        }
    }
);
import { ButtonInteraction, ButtonStyle, InteractionReplyOptions, InteractionUpdateOptions, Message, MessageEditOptions } from "discord.js"
import { ButtonBuilder } from "@discordjs/builders"

import PollData from "../interfaces/PollData"
import messageEmbed from "../embeds/messageembed"
import pollEmbed from "../embeds/pollembed"
import pollSettingsEmbed from "../embeds/pollsettingsembed"
import Button from "../structures/Button"
import ExtendedClient from "../structures/ExtendedClient"

module.exports = new Button(
    new ButtonBuilder()
        .setCustomId('toggleaddoptions')
        .setEmoji({ name: '➕' })
        .setStyle(ButtonStyle.Secondary),
    /*
         DESC: Toggles option to add options for the associated poll. 
          PRE: The poll exists and is valid.
        PARAM: i - Interaction from button press.
         POST: The add options is toggled and the poll post is updated.
    */
   async (i: ButtonInteraction) => {
        const client: ExtendedClient = i.client as ExtendedClient;
        const messageUrl: string = i.message.embeds[0].description.split('(').at(-1).slice(0, -2);
        
        try {
            // get poll data
            const poll: PollData = await client.mongo.db('Polls').collection<PollData>(i.guildId).findOne({
                messageUrl: messageUrl
            });

            // check if poll is already over
            if (poll.ended) {
                await i.reply(messageEmbed(
                    'You cannot toggle add options for a poll that has already ended.'
                ) as InteractionReplyOptions);
                return;
            }

            // update addOptions for poll in db
            await client.mongo.db('Polls').collection<PollData>(i.guild.id).updateOne(
                { messageUrl: messageUrl },
                {
                    $set: { addOptions: !poll.addOptions }
                }
            );

            // get updated poll
            const updatedPoll: PollData = await client.mongo.db('Polls').collection<PollData>(i.guildId).findOne({
                messageUrl: messageUrl
            });

            // convert options object into a map in updated poll
            updatedPoll.options = new Map(Object.entries(updatedPoll.options));

            // fetch poll post and update it
            const pollPost: Message = await i.channel.messages.fetch(messageUrl.split('/').at(-1));
            await pollPost.edit(pollEmbed(i, updatedPoll) as MessageEditOptions);

            // update poll settings post
            await i.update(pollSettingsEmbed(updatedPoll) as InteractionUpdateOptions);

        }
        catch (e: any) {
            throw Error();
        }

    }
);
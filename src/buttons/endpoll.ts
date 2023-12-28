import { ButtonInteraction, ButtonStyle, InteractionReplyOptions, Message, MessageEditOptions } from "discord.js"
import { ButtonBuilder } from "@discordjs/builders"

import PollData from "../interfaces/PollData"
import messageEmbed from "../embeds/messageembed"
import pollEmbed from "../embeds/pollembed"
import Button from "../structures/Button"
import ExtendedClient from "../structures/ExtendedClient"

module.exports = new Button(
    new ButtonBuilder()
        .setCustomId('endpoll')
        .setEmoji({ name: '🏁' })
        .setStyle(ButtonStyle.Secondary),
    /*
         DESC: Ends the associated poll. 
          PRE: The poll exists and is valid.
        PARAM: i - Interaction from button press.
         POST: The poll is set to ended and the poll post is updated to show final results.
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
                await i.reply(messageEmbed('This poll has already ended.') as InteractionReplyOptions);
                return;
            }

            // set poll to ended in db
            await client.mongo.db('Polls').collection<PollData>(i.guild.id).updateOne(
                { messageUrl: messageUrl },
                {
                    $set: { ended: true }
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

            await i.update({});
        }
        catch (e: any) {
            throw Error();
        }

    }
);
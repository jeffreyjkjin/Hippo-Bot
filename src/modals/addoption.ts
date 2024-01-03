import { ActionRowBuilder, InteractionReplyOptions, InteractionUpdateOptions, Message, ModalBuilder, ModalSubmitInteraction, TextInputStyle } from 'discord.js'
import { TextInputBuilder } from '@discordjs/builders'

import ExtendedClient from '../structures/ExtendedClient'
import Modal from '../structures/Modal'
import messageEmbed from '../embeds/messageembed';
import PollData from '../interfaces/PollData';
import pollEmbed from '../embeds/pollembed';

const addOption: TextInputBuilder = new TextInputBuilder()
    .setCustomId('option')
    .setLabel('Add a new poll option.')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('My epic option')
    .setMaxLength(200)
    .setRequired(true);

module.exports = new Modal(
    new ModalBuilder()
        .setCustomId('addoption')
        .setTitle('Add an option!')
        .addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(addOption)),
    /*
         DESC: Takes user input to add option to a poll.
          PRE: The poll exists and is valid; addOptions is set to true.
        PARAM: i - Interaction from modal submission.
         POST: Adds option to poll in db and updates poll post.
    */
    async (i: ModalSubmitInteraction) => {
        // format option
        const option: string = `${i.fields.getTextInputValue('option').trim()} [Added by *${i.user.globalName}*]`;

        const client: ExtendedClient = i.client as ExtendedClient;

        try {
            // check if option is already in db
            const poll: PollData = await client.mongo.db('Polls').collection<PollData>(i.guild.id).findOne({
                messageUrl: i.message.url
            });

            if (Object.keys(poll.options).includes(i.fields.getTextInputValue('option').trim())) {
                await i.reply(messageEmbed(
                    'You cannot add an existing option to the poll.'
                ) as InteractionReplyOptions);
                return;
            }

            // insert option into db
            await client.mongo.db('Polls').collection<PollData>(i.guild.id).updateOne(
                { messageUrl: i.message.url },
                {
                    $set: { [`options.${option}`]: [] }
                }
            );

            // fetch updated poll
            const updatedPoll: PollData = await client.mongo.db('Polls').collection<PollData>(i.guild.id).findOne(
                { messageUrl: i.message.url }
            );
            // cast options object into map
            updatedPoll.options = new Map(Object.entries(updatedPoll.options));

            // update poll post
            const pollPost: Message = await i.channel.messages.fetch(updatedPoll.messageUrl.split('/').at(-1));
            await pollPost.edit(pollEmbed(i, updatedPoll) as InteractionUpdateOptions);

            await i.reply(messageEmbed(
                `***${i.fields.getTextInputValue('option').trim()}*** has been added to [${updatedPoll.title}](${updatedPoll.messageUrl}).`
            ) as InteractionReplyOptions)
        }
        catch (e: any) {
            await i.reply(messageEmbed(
                'This option could not be added.'
            ) as InteractionReplyOptions)
        }
    }
);
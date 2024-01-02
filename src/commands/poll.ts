import { ChannelType, ChatInputCommandInteraction, InteractionReplyOptions, InteractionResponse } from "discord.js"
import { SlashCommandBooleanOption, SlashCommandBuilder, SlashCommandStringOption } from '@discordjs/builders'

import messageEmbed from "../embeds/messageembed"
import pollEmbed from "../embeds/pollembed"
import PollData from "../interfaces/PollData"
import Command from "../structures/Command"
import ExtendedClient from "../structures/ExtendedClient"
import checkImage from "../utils/checkimage"
import createPollMap from "../utils/createpollmap"
import pollModal from "../utils/pollmodal"

module.exports = new Command(
    new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Creates a new poll.')
        .addStringOption((option: SlashCommandStringOption) => {
            return option
                .setName('title')
                .setDescription('What is your poll called? (i.e., My awesome poll.)')
                .setMaxLength(256);
        })
        .addStringOption((option: SlashCommandStringOption) => {
            return option
                .setName('options')
                .setDescription('What are the options for your poll? You can have up to 15 options. (i.e., Cats, Dogs, etc.)')
                .setMaxLength(3820);
        })
        .addStringOption((option: SlashCommandStringOption) => {
            return option
                .setName('description')
                .setDescription('What is your poll about? (i.e., A poll for epic gamers.)')
                .setMaxLength(1024);
        })
        .addStringOption((option: SlashCommandStringOption) => {
            return option
                .setName('image')
                .setDescription('Add an image to your poll. (i.e. https://i.imgur.com/w8as1S9.png)');
        })
        .addBooleanOption((option: SlashCommandBooleanOption) => {
            return option
                .setName('single_vote')
                .setDescription('Can voters vote for more than one option?');
        })
        .addBooleanOption((option: SlashCommandBooleanOption) => {
            return option
                .setName('add_options')
                .setDescription('Can users add other options to this poll?');
        }),
    /*
         DESC: Allows users to create a poll using their command arguments.
          PRE: All arguments passed to this command are valid
        PARAM: i - Generic interaction from command call.
         POST: A new poll is added to the db and an embed for the poll is displayed.
    */
    async (i: ChatInputCommandInteraction) => {
        // only allow use of this command in regular text channels in guild
        if (!i.channel) {
            await i.reply(messageEmbed(
                'This command can only be used in a server.'
            ) as InteractionReplyOptions);
            return;
        }

        if (i.channel.type !== ChannelType.GuildText) {
            await i.reply(messageEmbed(
                'This command can only be used in a regular text channel.'
            ) as InteractionReplyOptions);
            return;
        }

        // create poll with command arguments
        const poll: PollData = {
            title: i.options.getString('title'),
            description: i.options.getString('description'),
            options: null,
            totalVotes: 0,
            singleVote: i.options.getBoolean('single_vote') ? i.options.getBoolean('single_vote') : false,
            addOptions: i.options.getBoolean('add_options') ? i.options.getBoolean('add_options') : true,
            image: i.options.getString('image'),
            messageUrl: null,
            creatorId: i.user.id,
            ended: false
        }

        // display modal if not all required fields were given
        if (!poll.title || !i.options.getString('options')) {
            if (i.options.getString('options')) {
                // if user entered options, set the string to the first entry of the options map
                poll.options = new Map<string, string[]>([[i.options.getString('options'), []]]);
            }
            await i.showModal(pollModal('createpoll', poll));
            return;
        }

        // check if options are valid
        try {
            poll.options = createPollMap(i.options.getString('options'))
        }
        catch (e: any) {
            i.reply(messageEmbed(e.toString()) as InteractionReplyOptions);
            return;
        }

        // check if image is valid
        if (poll.image) {
            try {
                checkImage(poll.image);
            }
            catch (e: any) {
                i.reply(messageEmbed(e.toString()) as InteractionReplyOptions);
                return;
            }
        }

        // insert poll into db and create poll embed post
        const client: ExtendedClient = i.client as ExtendedClient;
        try {
            const message: InteractionResponse = await i.reply(pollEmbed(i, poll) as InteractionReplyOptions);
            poll.messageUrl = (await message.fetch()).url;

            await client.mongo.db('Polls').collection<PollData>(i.guild.id).insertOne(poll);
        }
        catch (e: any) {
            console.log(e);
            await i.reply(messageEmbed(
                'This poll could not be created.'
            ) as InteractionReplyOptions);
        }
    }
);
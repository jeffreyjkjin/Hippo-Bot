import { ChannelType, ChatInputCommandInteraction, InteractionReplyOptions, InteractionResponse, SlashCommandBuilder, SlashCommandStringOption } from 'discord.js'

import messageEmbed from '../embeds/messageembed'
import ReminderData from '../interfaces/ReminderData'
import Command from '../structures/Command'
import ExtendedClient from '../structures/ExtendedClient'
import parseDate from '../utils/parsedate'
import reminderEmbed from '../embeds/reminderembed'
import subscribeReminderEmbed from '../embeds/subscribereminderembed'

module.exports = new Command(
    new SlashCommandBuilder()
        .setName('remind')
        .setDescription('Creates a new reminder.')
        .addStringOption((option: SlashCommandStringOption) => {
            return option
                .setName('title')
                .setDescription('What is your reminder called? (i.e. My awesome reminder.)')
                .setRequired(true)
                .setMaxLength(4000);
        })
        .addStringOption((option: SlashCommandStringOption) => {
            return option
                .setName('datetime')
                .setRequired(true)
                .setDescription('When is your reminder? (i.e., October 2, 2023 10:00 PM PST)')            
        }),
    /*
         DESC: Creates a reminder based on user arguments.
          PRE: Arguments passed to this command are valid.
        PARAM: i - Interaction from slash command submission.
         POST: Inserts reminder into db and generates a reminder post.
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

        // create reminder with command arguments
        const reminder: ReminderData = {
            title: i.options.getString('title'),
            datetime: i.options.getString('datetime'),
            subscribers: [i.user.id],
            messageUrl: null,
            creatorId: i.user.id,
            reminded: false
        }

        // check if time is valid
        try {
            reminder.datetime = parseDate(reminder.datetime);
        }
        catch (e: any) {
            i.reply(messageEmbed(e.toString()) as InteractionReplyOptions);
            return;
        }
        
        const client: ExtendedClient = i.client as ExtendedClient;
        try {
            // insert reminder into db and create reminder post
            const message: InteractionResponse = await i.reply(reminderEmbed(i, reminder) as InteractionReplyOptions);
            reminder.messageUrl = (await message.fetch()).url;

            await client.mongo.db('Reminders').collection<ReminderData>(i.guild.id).insertOne(reminder);

            // send user a reminder confirmation
            await i.user.send(subscribeReminderEmbed(reminder));
        }
        catch (e: any) {
            await i.reply(messageEmbed(
                'This reminder could not be created.'
            ) as InteractionReplyOptions);
        }
    }
);
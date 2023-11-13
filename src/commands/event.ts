import { ChatInputCommandInteraction, InteractionReplyOptions, InteractionResponse } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'

import eventEmbed from '../embeds/eventembed'
import EventData from '../interfaces/EventData'
import Command from '../structures/Command'
import ExtendedClient from '../structures/ExtendedClient'
import eventModal from '../utils/eventmodal'
import parseDate from '../utils/parsedate'

module.exports = new Command(
    new SlashCommandBuilder()
        .setName('event')
        .setDescription('Creates a new event.')
        .addStringOption((option) => {
            return option
                .setName('title')
                .setDescription('What is your event called? (i.e., My awesome event)');
        })
        .addStringOption((option) => {
            return option
                .setName('datetime')
                .setDescription('When is your event? (i.e., October 2, 2023 10:00 PM PST)');
        })
        .addStringOption((option) => {
            return option
                .setName('description')
                .setDescription('What is your event about? (i.e., An epic event for epic gamers.)');
        })
        .addStringOption((option) => {
            return option
                .setName('image')
                .setDescription('Add an image to your event. (i.e., https://i.imgur.com/w8as1S9.png)');
        }),
    /*
         DESC: Allows user to create an event using command arguments. 
          PRE: Arguments passed to this command are valid.
        PARAM: i - Interaction from command call.
         POST: A new event is added to db and an embed display this event is posted.
    */
    async (i: ChatInputCommandInteraction) => {
        // only allow use of this command in regular text channels in guild
        if (!i.channel) {
            await i.reply({
                content: 'This command can only be used in a server.',
                ephemeral: true
            });
            return;
        }

        if (i.channel.isThread() || i.channel.isVoiceBased()) {
            await i.reply({
                content: 'This command can only be used in a regular text channel.',
                ephemeral: true
            });
            return;
        }

        // create event with command arguments
        const event: EventData = {
            title: i.options.getString('title'),
            description: i.options.getString('description'),
            datetime: i.options.getString('datetime'),
            attendees: [] as string[],
            maybe: [] as string[],
            pass: [] as string[],
            image: i.options.getString('image'),
            channelId: i.channelId,
            messageUrl: null,
            creatorId: i.user.id,
            started: false
        }
        
        // display modal if not all required fields were given
        if (!event.title || !event.datetime) {
            await i.showModal(eventModal('createevent', event));
            return;
        }
        
        // insert event into db and create event embed post
        const client: ExtendedClient = i.client as ExtendedClient;
        try {
            event.datetime = parseDate(event.datetime);
            
            const message: InteractionResponse = await i.reply(eventEmbed(i, event) as InteractionReplyOptions);
            event.messageUrl = (await message.fetch()).url;

            await client.mongo.db('Events').collection<EventData>(i.guild.id).insertOne(event);
        }
        catch (e: any) {
            await i.reply({ 
                content: e.toString(), 
                ephemeral: true
            });
        }
    }
);
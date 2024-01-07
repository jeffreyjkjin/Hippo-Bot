import { ChannelType, ChatInputCommandInteraction, InteractionReplyOptions } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'

import listEventsEmbed from '../embeds/listeventsembed'
import messageEmbed from '../embeds/messageembed'
import EventData from '../interfaces/EventData'
import Command from '../structures/Command'
import ExtendedClient from '../structures/ExtendedClient'

module.exports = new Command(
    new SlashCommandBuilder()
        .setName('list')
        .setDescription("Displays a list of events scheduled on this server."),
    /*
         DESC: Shows the user what events have been scheduled on this server.
          PRE: All scheduled events exist and are valid.
        PARAM: i - Interaction from command call.
         POST: Shows user an embed with the servers scheduled events.
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
        
        const client: ExtendedClient = i.client as ExtendedClient;

        try {
            // fetch events and show to user
            const events: EventData[] = await client.mongo.db('Events').collection<EventData>(i.guild.id).find({
                started: false
            }).toArray();

            await i.reply(listEventsEmbed(events) as InteractionReplyOptions);
        }
        catch (e: any) {
            await i.reply(messageEmbed(
                'The list of events for this server could not be displayed.'
            ) as InteractionReplyOptions);
        }
    }
);

function MessageEmbed(arg0: string): InteractionReplyOptions & { fetchReply: true } {
    throw new Error('Function not implemented.')
}

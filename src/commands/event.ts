import { ChatInputCommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'

import EventEmbed from '../embeds/eventembed'
import EventData from '../interfaces/EventData'
import Command from '../structures/Command'
import createEventModal from '../utils/createeventmodal'
import insertEvent from '../utils/insertevent'
import parseDate from '../utils/parsedate'

module.exports = new Command(
    new SlashCommandBuilder()
        .setName('event')
        .setDescription('Creates a new event.')
        .addStringOption((option) => {
            return option
                .setName('title')
                .setDescription('What is your event called?')
        })
        .addStringOption((option) => {
            return option
                .setName('datetime')
                .setDescription('When is your event?')
        })
        .addStringOption((option) => {
            return option
                .setName('description')
                .setDescription('What is your event about?')
        })
        .addStringOption((option) => {
            return option
                .setName('image')
                .setDescription('Add an image to your event.')
        }),
    async (i: ChatInputCommandInteraction) => {
        
        const event: EventData = {
            title: i.options.getString('title'),
            description: i.options.getString('description'),
            datetime: i.options.getString('datetime'),
            attendees: [] as string[],
            maybe: [] as string[],
            pass: [] as string[],
            image: i.options.getString('image'),
            creator: i.user.id
        }
        
        if (!event.title || !event.datetime) {
            await i.showModal(createEventModal(event));
            return;
        }
        
        try {
            event.datetime = parseDate(event.datetime);
            
            await insertEvent(i, event);
            await i.reply({ embeds: [EventEmbed(i, event)] });
        }
        catch (e) {
            await i.reply({ 
                content: e.toString().slice(7,), 
                ephemeral: true
            });
        }
    }
);
import { ChatInputCommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'

import EventEmbed from '../embeds/eventembed'
import EventData from '../interfaces/EventData'
import CreateEventModal from '../utils/createeventmodal'
import Command from '../structures/Command'

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
                .setName('time')
                .setDescription('What time is your event at?')
        })
        .addStringOption((option) => {
            return option
                .setName('date')
                .setDescription('What day is your event on?')
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
            time: i.options.getString('time'),
            date: i.options.getString('date'),
            datetime: null,
            attendees: [] as string[],
            maybe: [] as string[],
            pass: [] as string[],
            image: i.options.getString('image'),
            creator: i.user.id
        }

        if (!event.title || !event.time) {
            await i.showModal(CreateEventModal(event));
        }
        else {
            await i.reply({ embeds: [EventEmbed(i, event)] });
        }
    }
);
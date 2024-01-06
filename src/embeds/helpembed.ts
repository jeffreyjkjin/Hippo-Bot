import { Colors, EmbedBuilder, MessageCreateOptions } from 'discord.js'

/*
     DESC: Displays information about how to use the bot.
     POST: Returns embed.
*/
const helpEmbed = (): MessageCreateOptions => {
    const create: string = 'Creates a new event.\n' + 
        'Users can choosed to either ✅ attend, 🤷 maybe, or ❌ pass an event.\n' +
        'Users who choose to attend an event will be pinged when it starts.\n' +
        '> /create `title: My awesome event` `datetime: October 2, 2023 10:00 PM PST`\n'

    const poll: string = 'Creates a new poll.\n' + 
        'Users can choose what options they would like to vote for and the results are displayed in real time.\n' +
        '> /poll `title: My awesome poll.` `options: Cats, Dogs, etc.`\n'

    const remind: string = 'Creates a new reminder.\n' +
        'Users can 🔔 subscribe to a reminder and gets a message when the reminder goes off.\n' +
        '> /reminder `title: My awesome reminder.` `datetime: October 2, 2023 10:00 PM PST`';

    const embed: EmbedBuilder = new EmbedBuilder()
        .setTitle('❔ Help')
        .setDescription('Quickly schedule events, set reminders, and create polls natively all without ever having to leave Discord.\n' +
            'Check out the source code on [Github](https://github.com/jeffreyjkjin/Hippo-Bot).')
        .setColor(Colors.Green)
        .addFields(
            {
                name: '/create',
                value: create
            },
            {
                name: '/poll',
                value: poll
            },
            {
                name: '/remind',
                value: remind
            }, 
            {
                name: '/list',
                value: 'Displays a list of every scheduled event for a guild.'
            }
        );

    return {
        ephemeral: true,
        embeds: [embed]
    } as MessageCreateOptions;
}

export default helpEmbed;
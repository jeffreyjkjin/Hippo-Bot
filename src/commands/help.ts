import { ChatInputCommandInteraction, InteractionReplyOptions } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'


import helpEmbed from '../embeds/helpembed'
import Command from '../structures/Command'

module.exports = new Command(
    new SlashCommandBuilder()
        .setName('help')
        .setDescription("Displays information about each one of Hippo Bot's commands."),
    /*
         DESC: Displays information about Hippo Bot's commands to the user.
        PARAM: i - Interaction from command call.
         POST: User is shown an embed about Hippo Bot.
    */
    async (i: ChatInputCommandInteraction) => {
        try {
            await i.reply(helpEmbed() as InteractionReplyOptions);
        }
        catch (e: any) {
            throw Error();
        }
    }
);
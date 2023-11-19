import { Colors, MessageCreateOptions } from "discord.js"
import { EmbedBuilder } from "@discordjs/builders"


/*
     DESC: Creates an ephemeral embed using the provided description.
      PRE: description length does not exceed 4096 characters.
    PARAM: description - Text of embed.
     POST: Returns embed.
*/
const messageEmbed = (description: string): MessageCreateOptions => {
    const embed: EmbedBuilder = new EmbedBuilder()
        .setColor(Colors.Green)
        .setDescription(description);

    return {
        embeds: [embed],
        components: [],
        ephemeral: true
    } as MessageCreateOptions;
}

export default messageEmbed;
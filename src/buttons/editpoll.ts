import { ButtonInteraction, ButtonStyle } from "discord.js"
import { ButtonBuilder } from "@discordjs/builders"

import PollData from "../interfaces/PollData"
import Button from "../structures/Button"
import ExtendedClient from "../structures/ExtendedClient"
import pollModal from "../utils/pollmodal"

module.exports = new Button(
    new ButtonBuilder()
    .setCustomId('editpoll')
    .setEmoji({ name: '📝' })
    .setStyle(ButtonStyle.Secondary),
    /*
        DESC: Allows user to edit an poll.
        PRE: The poll exists and is valid.
        PARAM: i - Interaction from button press.
        POST: The poll is moved to the user's EditPoll collection and a modal to edit the poll is displayed.
    */
   async (i: ButtonInteraction) => {
        const client: ExtendedClient = i.client as ExtendedClient;
        const messageUrl: string = i.message.embeds[0].description.split('(').at(-1).slice(0, -2);
        
        try {
            const poll: PollData = await client.mongo.db('Polls').collection<PollData>(i.guildId).findOne({
                messageUrl: messageUrl
            });

            // only one event should be in each user's EditEvent collection
            if (await client.mongo.db('EditPoll').collection<PollData>(i.user.id).countDocuments() > 0) {
                await client.mongo.db('EditPoll').collection<PollData>(i.user.id).deleteMany({});
            }

            // insert poll into users EditPoll collection and display modal to edit it
            await client.mongo.db('EditPoll').collection(i.user.id).insertOne(poll);
            await i.showModal(pollModal('editpoll', poll));
        }
        catch (e: any) {
            throw Error();
        }

    }
);
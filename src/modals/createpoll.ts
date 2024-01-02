import { InteractionReplyOptions, InteractionResponse, ModalSubmitInteraction } from 'discord.js'

import messageEmbed from '../embeds/messageembed'
import pollEmbed from '../embeds/pollembed'
import PollData from '../interfaces/PollData'
import ExtendedClient from '../structures/ExtendedClient'
import Modal from '../structures/Modal'
import checkImage from '../utils/checkimage'
import createPollMap from '../utils/createpollmap'
import pollModal from '../utils/pollmodal'

module.exports = new Modal(
    pollModal('createpoll'),
    /*
         DESC: Creates a poll using the details provided from the modal.
          PRE: The data from the modal is valid.
        PARAM: i - Interaction from modal submission.
         POST: Inserts a poll into db and creates a poll embed for it.
    */
    async (i: ModalSubmitInteraction) => {
        const client: ExtendedClient = i.client as ExtendedClient;
        
        const poll: PollData = {
            title: i.fields.getTextInputValue('title'),
            description: i.fields.getTextInputValue('description'),
            options: null,
            totalVotes: 0,
            singleVote: false,
            addOptions: true,
            image: i.fields.getTextInputValue('image'),
            messageUrl: null,
            creatorId: i.user.id,
            ended: false
        }

        // check if options are valid
        try {
            poll.options = createPollMap(i.fields.getTextInputValue('options'))
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
        try {
            const message: InteractionResponse = await i.reply(pollEmbed(i, poll) as InteractionReplyOptions);
            poll.messageUrl = (await message.fetch()).url;
            
            await client.mongo.db('Polls').collection(i.guild.id).insertOne(poll);
        }
        catch (e: any) {
            await i.reply(messageEmbed(
                'This poll could not be created.'
            ) as InteractionReplyOptions);
        }
    }
);
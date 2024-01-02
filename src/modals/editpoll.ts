import { InteractionReplyOptions, Message, MessageEditOptions, ModalSubmitInteraction } from 'discord.js'

import pollEmbed from '../embeds/pollembed'
import messageEmbed from '../embeds/messageembed'
import PollData from '../interfaces/PollData'
import ExtendedClient from '../structures/ExtendedClient'
import Modal from '../structures/Modal'
import checkImage from '../utils/checkimage'
import pollModal from '../utils/pollmodal'

module.exports = new Modal(
    pollModal('editpoll'),
    /*
         DESC: Updates the poll using the data gathered from the modal. 
          PRE: The poll being edited is valid and exists.
        PARAM: i - Interaction from modal submission.
         POST: Both the poll fields in the db and it's embed post are updated.
    */
    async (i: ModalSubmitInteraction) => {
        const client: ExtendedClient = i.client as ExtendedClient;

        const title: string = i.fields.getTextInputValue('title');
        const description: string = i.fields.getTextInputValue('description');
        const image: string = i.fields.getTextInputValue('image');
        
        // check if image is valid
        if (image) {
            try {
                checkImage(image);
            }
            catch (e: any) {
                i.reply(messageEmbed(e.toString()) as InteractionReplyOptions);
                return;
            }
        }
        
        try {
            // update poll
            const poll: PollData = await client.mongo.db('EditPoll').collection<PollData>(i.user.id).findOne({});
            await client.mongo.db('Polls').collection<PollData>(i.guild.id).updateOne(
                { messageUrl: poll.messageUrl },
                {
                    $set: {
                        title: title,
                        description: description,
                        image: image
                    }
                }
            );

            // delete poll from user's EditPoll collection
            await client.mongo.db('EditPoll').collection<PollData>(i.user.id).deleteMany({});

            // fetch updated poll
            const updatedPoll: PollData = await client.mongo.db('Polls').collection<PollData>(i.guild.id).findOne(
                { messageUrl: poll.messageUrl }
            );

            // convert options object back into map
            updatedPoll.options = new Map(Object.entries(updatedPoll.options));
            
            // update poll post
            const pollPost: Message = await i.channel.messages.fetch(poll.messageUrl.split('/').at(-1));
            await pollPost.edit(pollEmbed(i, updatedPoll) as MessageEditOptions);
            
            await i.reply(messageEmbed(
                `[**${updatedPoll.title}**](${updatedPoll.messageUrl}) has been updated.`
            ) as InteractionReplyOptions);

        }
        catch (e: any) {
            await i.reply(messageEmbed(
                `This poll could not be updated.`
            ) as InteractionReplyOptions);
        }
    }
);
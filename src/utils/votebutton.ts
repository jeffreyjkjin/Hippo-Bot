import { ButtonInteraction, ButtonStyle, InteractionUpdateOptions } from "discord.js"
import { ButtonBuilder } from "@discordjs/builders"

import getPollSymbol from "./getpollsymbol"
import pollEmbed from "../embeds/pollembed"
import PollData from "../interfaces/PollData"
import Button from "../structures/Button"
import ExtendedClient from "../structures/ExtendedClient"

/*
     DESC: Generates a button used to vote for an option.
      PRE: option and optionNum correspond to an associated option in the poll.
    PARAM: option - The name of the option from the poll.
           optionNum - The index of the option in the options map from the poll.
     POST: Returns button.
*/
const voteButton = (option?: string, optionNum?: number): Button => {
    return new Button(
        new ButtonBuilder()
            .setCustomId(option ? `vote_${option}` : 'vote')
            .setEmoji({ name: optionNum && `${getPollSymbol(optionNum)}`})
            .setStyle(ButtonStyle.Secondary),
        /*
             DESC: Lets user vote for the associated option.
              PRE: The button is associated with a valid option
            PARAM: i - Generic interaction from button.
             POST: THe users name is added to/removed from the voter list of the associated option.
        */
        async (i: ButtonInteraction) => {
            try {
                // fetch poll
                const client: ExtendedClient = i.client as ExtendedClient;

                const poll: PollData = await client.mongo.db('Polls').collection<PollData>(i.guild.id).findOne({
                    messageUrl: i.message.url 
                });                

                // get user option
                const userOption: string = i.customId.slice(5);

                // remove users vote from option if they click the same button again
                if (poll.options[userOption].includes(i.user.id)) {
                    await client.mongo.db('Polls').collection<PollData>(i.guild.id).updateOne(
                        { messageUrl: i.message.url },
                        {
                            $pull: { [`options.${userOption}`]: i.user.id },
                            $inc: { totalVotes: -1 }
                        }
                    );                    
                }
                else {
                    // add users vote to option
                    await client.mongo.db('Polls').collection<PollData>(i.guild.id).updateOne(
                        { messageUrl: i.message.url },
                        {
                            $push: { [`options.${userOption}`]: i.user.id },
                            $inc: { totalVotes: 1 }
                        }
                    );
                }

                // fetch updated poll
                let updatedPoll: PollData = await client.mongo.db('Polls').collection<PollData>(i.guild.id).findOne({ 
                    messageUrl: i.message.url 
                });

                // convert options object into a map in updated poll
                updatedPoll.options = new Map(Object.entries(updatedPoll.options));
                
                // update the poll post
                await i.update(pollEmbed(i, updatedPoll) as InteractionUpdateOptions);
            }
            catch (e: any) {
                throw Error();
            }
        }
    );
}

export default voteButton;
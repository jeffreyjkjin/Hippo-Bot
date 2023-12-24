import { BaseInteraction, Colors, EmbedBuilder, MessageCreateOptions } from 'discord.js'
import { ActionRowBuilder, ButtonBuilder } from '@discordjs/builders'

import PollData from '../interfaces/PollData'
import getPollSymbol from '../utils/getpollsymbol'
import voteButton from '../utils/votebutton'

/*
     DESC: Displays poll options and buttons to allow user to vote.
      PRE: The poll is valid.
    PARAM: i - Generic interaction.
           poll - Data associated with the poll.
     POST: Returns embed.
*/
const pollEmbed = (i: BaseInteraction, poll: PollData): MessageCreateOptions => {
    const creator: string = i.client.users.cache.get(poll.creatorId).globalName;

    const singleVote = `${!poll.singleVote ? 
        'You may vote for multiple options in this poll.' : 
        'You may select only one option in this poll'}`;
    const addOptions = `${poll.addOptions && poll.options.size < 15 ? '➕ Add Option | ' : ''}`;

    const embed: EmbedBuilder = new EmbedBuilder()
        .setTitle(`📊 **${poll.title}**`)
        .setColor(Colors.Green)
        .setDescription(poll.description ? poll.description : null)
        .setImage(poll.image ? poll.image : null)
        .setFooter({ 
            text: `${singleVote}\n${addOptions}⚙️ Settings | Created by ${creator}` 
        });

    // sort poll options by most votes if poll is over
    if (poll.ended) {
        poll.options = new Map(
            [...poll.options.entries()].sort((a: [string, string[]], b: [string, string[]]): number => { 
                return b[1].length - a[1].length; 
            })
        );        
    }
    
    // initalize rows of buttons (grid will be up to 5x4)
    const buttonRows: ActionRowBuilder<ButtonBuilder>[] = [new ActionRowBuilder<ButtonBuilder>()];
    let rowNum: number = 0;
    let buttonNum: number = 0;

    // generate poll options
    let optionNum: number = 1;
    let symbol: string;

    poll.options.forEach((voters: string[], option: string) => {
        if (!poll.ended) {
            // if poll isn't over, set symbol and add button
            symbol = getPollSymbol(optionNum); 
            
            // once row is full, move to next one
            if (buttonNum > 4) {
                buttonNum = 0;
                buttonRows.push(new ActionRowBuilder<ButtonBuilder>())
                rowNum++;
            }
            
            buttonRows[rowNum].addComponents(new ButtonBuilder(voteButton(option, optionNum).toJSON()));
            buttonNum++;
        }
        else {
            // set symbol for top 3 most voted options
            if (optionNum === 0) {
                symbol = ':first_place:';
            }
            if (optionNum === 1) { 
                symbol = ':second_place:';
            }
            else if (optionNum === 2) {
                symbol = ':third_place:';
            }
        }
        
        // calculate percentage bar for each option
        const voteSquares: number = voters.length ? Math.round(10 * (voters.length/poll.totalVotes)) : 0;
        const voteBar: string = ':white_large_square:'.repeat(voteSquares);
        const emptyBar: string = ':black_large_square:'.repeat(10 - voteSquares);
        const percentage: number = voters.length ? Math.round(voters.length/poll.totalVotes * 10000)/100 : 0;
        
        embed.addFields({
            name: `${symbol} ${option}`,
            value: `${voteBar + emptyBar} | ${percentage}% (${voters.length})`
        });
        
        optionNum++;
    });

    return {
        embeds: [embed],
        components: buttonRows
    } as MessageCreateOptions;
}

export default pollEmbed;


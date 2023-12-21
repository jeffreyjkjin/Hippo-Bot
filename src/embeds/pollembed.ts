import { BaseInteraction, Colors, EmbedBuilder, MessageCreateOptions } from 'discord.js'

import PollData from '../interfaces/PollData'
import getPollSymbol from '../utils/getpollsymbol'

/*
     DESC: Displays poll options and buttons to allow user to vote.
      PRE: The poll is valid.
    PARAM: i - Generic interaction.
           poll - Data associated with the poll.
     POST: Returns embed.
*/
const pollEmbed = (i: BaseInteraction, poll: PollData): MessageCreateOptions => {
    const creator: string = i.client.users.cache.get(poll.creatorId).globalName;

    const embed: EmbedBuilder = new EmbedBuilder()
        .setTitle(`📊 **${poll.title}**`)
        .setColor(Colors.Green)
        .setDescription(poll.description ? poll.description : null)
        .setImage(poll.image ? poll.image : null)
        .setFooter({ 
            text: `${poll.singleVote ? 'You may vote for multiple options in this poll.' : ''}
            ${poll.addOptions ? '➕ Add Option | ' : ''}⚙️ Settings | Created by ${creator}` 
        });

    // sort poll options by most votes if poll is over
    if (poll.ended) {
        poll.options = new Map(
            [...poll.options.entries()].sort((a: [string, string[]], b: [string, string[]]): number => { 
                return b[1].length - a[1].length; 
            })
        );        
    }
            
    let count: number = 0;
    let symbol: string = !poll.ended ? getPollSymbol(0) : ':first_place:';
            
    // generate poll options
    poll.options.forEach((voters: string[], option: string) => {
        // calculate percentage bar for each option
        const voteSquares: number = voters.length ? Math.round(10 * (voters.length/poll.totalVotes)) : 0;
        const voteBar: string = ':white_large_square:'.repeat(voteSquares);
        const emptyBar: string = ':black_large_square:'.repeat(10 - voteSquares);

        embed.addFields({
            name: `${symbol} ${option}`,
            value: `${voteBar + emptyBar} | ${voters.length ? voters.length/poll.totalVotes : 0} (${voters.length})`
        });

        // update symbol to next letter
        count++;
        if (!poll.ended) {
            symbol = getPollSymbol(count); 
        }
        else {
            if (count === 1) { 
                symbol = ':second_place:'
            }
            else if (count === 2) {
                symbol = ':third_place:'
            }
        }
    });
    
    return {
        embeds: [embed]
    } as MessageCreateOptions;
}

export default pollEmbed;


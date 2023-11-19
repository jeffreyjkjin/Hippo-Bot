import Event from '../structures/Event'
import ExtendedClient from '../structures/ExtendedClient'

module.exports = new Event(
    'ready',
    true,
    /*
         DESC: Prints a confirmation that bot is online to console.
          PRE: Bot is working correctly.
        PARAM: client - The main client of the bot.
    */
    (client: ExtendedClient) => {
        console.log(`${client.user && client.user.tag} is online!`);
    }
);
import Event from '../structures/Event'
import ExtendedClient from '../structures/ExtendedClient'

module.exports = new Event(
    'ready',
    true,
    /*
         DESC: Initialize bot's details.
          PRE: Bot is working correctly.
        PARAM: client - The main client of the bot.
         POST: Prints confirmation message in console.
    */
    (client: ExtendedClient) => {
        // initialize bot details
        client.user.setUsername('Hippo Bot');
        client.user.setAvatar('https://i.imgur.com/CY9g73e.png');
        client.user.setPresence({
            activities: [{ name: 'God | /help' }],
            status: 'online'
        });

        console.log(`${client.user && client.user.tag} is online!`);
    }
);
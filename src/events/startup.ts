import Event from '../structures/Event'
import ExtendedClient from '../structures/ExtendedClient'

module.exports = new Event(
    'ready',
    true,
    (client: ExtendedClient) => {
        console.log(`${client.user && client.user.tag} is online!`);
    }
);
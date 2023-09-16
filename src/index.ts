import { config } from 'dotenv'

import ExtendedClient from './structures/ExtendedClient'

config();

const client: ExtendedClient = new ExtendedClient();

client.on('ready', () => {
    console.log(`${client.user && client.user.tag} is online!`);
});

client.login(process.env.TOKEN);
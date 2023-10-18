import { config } from 'dotenv'

import ExtendedClient from './structures/ExtendedClient'

config();

const client: ExtendedClient = new ExtendedClient();

client.login(process.env.TOKEN);
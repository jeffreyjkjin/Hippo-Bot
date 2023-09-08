import { config } from 'dotenv'
import { Client, GatewayIntentBits } from 'discord.js'

config();

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.login(process.env.TOKEN);

client.on('ready', () => {
    console.log(`${client.user && client.user.tag} is online!`);
});

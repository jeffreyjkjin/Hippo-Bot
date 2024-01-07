# Hippo Bot
![Demo](demo.gif)

Hippo Bot is a simple Discord bot written in TypeScript that allows users to create events, reminders, and polls natively.

## Dependencies 
This bot uses the following dependencies:
- [day.js](https://day.js.org/)
- [discord.js](https://discord.js.org/)
- [mongodb](https://www.npmjs.com/package/mongodb)

## Getting Started
### Installation
To install the required dependencies, use
```
npm install
```
### Setup
This bot requires the use of a Discord bot token and a MongoDB connection url as well as client and guild ids for registering slash commands. Create an `.env` file in the root directory and fill it with the following contents:
```
TOKEN=your_discord_bots_token
CLIENT=your_discord_bots_client_id
GUILD=your_discord_guild_id
MONGO=your_mongodb_connection_urrl
```
### Development
To run the bot in development mode, use
```
npm run start:dev
```
### Production
To build the bot, use
```
npm run build
```
Then, to run the bot, use
```
npm run start:prod
```
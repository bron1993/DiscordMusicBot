import { Client, GatewayIntentBits } from 'discord.js';
import AudioPlayer from './AudioPlayer';
import BotClient from './BotClient'
//const express = require('express');


/** LOCAL  */
const discordClient = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages] });
const audioPlayer = new AudioPlayer();
const bot = new BotClient(discordClient, audioPlayer);

bot.SetUp();


/** HEROKU */
// const app = express();
// const port = (process.env.PORT || 5000)
// app.set('port', port);

// app.listen(port, () => {
//     console.log(`Discord Bot listening on port ${port}`)
// })

// app.get('/', async (req, res) => {
//     res.send('Starting Discord Bot');
//     const discordClient = new Client({ intents: GatewayIntentBits.Guilds | GatewayIntentBits.GuildVoiceStates });
//     const bot = new BotClient(discordClient);
//     await bot.SetUp();

// });
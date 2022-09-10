const { SlashCommandBuilder, Routes, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');
const { REST } = require('@discordjs/rest');
import { CommandFactory } from './Commands/CommandFactory';
import { DISCORD_TOKEN, DISCORD_APPLICATION_ID, DISCORD_SERVER_ID } from './config.json';


class BotClient {
    private discordClient;
    private audioPlayer;
    constructor(discordClient: any, audioPlayer: any) {
        this.discordClient = discordClient;
        this.audioPlayer = audioPlayer;
    }

    public async SetUp() {
        this.discordClient.once('ready', () => {
            console.log('Ready!');
        });

        this.discordClient.on('interactionCreate', async interaction => {
            if (!interaction.isChatInputCommand() && !interaction.isSelectMenu()) return;
            await interaction.deferReply();
            const voiceChannel = interaction.member.voice?.channel;
            if (!voiceChannel) {
                await interaction.editReply(`Hey **${interaction.member.nickname}**, please join a voice channel.`);
                return false;
            }
            const cmdFactory = new CommandFactory(this.audioPlayer, voiceChannel);

            const commandName = interaction.commandName || 'play';
            const command = cmdFactory.getCommand(commandName);
            
            command.execute(interaction);
            return;
        });

        await this.discordClient.login(DISCORD_TOKEN);
        await this.RegisterCommands();
    }

    private async RegisterCommands() {

        const commands = [
            new SlashCommandBuilder().setName('stop').setDescription('Stop music!'),
            new SlashCommandBuilder().setName('search').setDescription('Search for music!').
                addStringOption(option =>
                    option.setName('query')
                        .setDescription('The song name')
                        .setRequired(true)),
            new SlashCommandBuilder().setName('play').setDescription('Play music url!').
                addStringOption(option =>
                    option.setName('url')
                        .setDescription('The song url')
                        .setRequired(true)),
        ]
            .map(command => command.toJSON());

        const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);
        rest.put(Routes.applicationGuildCommands(DISCORD_APPLICATION_ID, DISCORD_SERVER_ID), { body: commands })
            .then(() => console.log('Successfully registered application commands.'))
            .catch(console.error);
    }
}

export default BotClient;
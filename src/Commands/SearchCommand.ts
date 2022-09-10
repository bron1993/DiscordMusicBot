import { ICommand } from "./ICommand";

const {ActionRowBuilder, SelectMenuBuilder } = require('discord.js');

export class SearchCommand implements ICommand {

    audioPlayer;
    voiceChannel;
    public constructor(audioPlayer, voiceChannel) {
        this.audioPlayer = audioPlayer;
        this.voiceChannel = voiceChannel;
    }

    public async execute(interaction) {
        const query = interaction.options.getString('query', true);
        const results = await this.audioPlayer.searchSong(query);

        const parsedResults = results.map(({ title, durationRaw, url }) => ({label: title, description: durationRaw, value: url}));
            const row = new ActionRowBuilder()
                .addComponents(new SelectMenuBuilder()
                .setCustomId('select')
                .setPlaceholder('Is this what you were looking for?')
                .addOptions(parsedResults));

        await interaction.editReply({ components: [row], fetchReply: true });
    }
}
import { ICommand } from "./ICommand";


export class PlayCommand implements ICommand {

    audioPlayer;
    voiceChannel;
    public constructor(audioPlayer, voiceChannel) {
        this.audioPlayer = audioPlayer;
        this.voiceChannel = voiceChannel;
    }

    public async execute(interaction) {
        const song = interaction.options?.getString('url', true) || interaction.values[0];

        if (!song) {
            await interaction.editReply(`Hey **${interaction.member.nickname}**, please enter a song url.`);
            return;
        }
        try {
            await this.audioPlayer.connectToVoiceChannel(this.voiceChannel);
        }
        catch (err) {
            console.log(err);
            await interaction.editReply(`Hey **${interaction.member.nickname}**, there was an error connecting to the voice channel ${this.voiceChannel.name}. \n **Error**: ${err.message}`);
            return;
        }

        let videoInfo;
        try {
            videoInfo = await this.audioPlayer.getVideoInfo(song);
        }
        catch (err) {
            await interaction.editReply(`Hey **${interaction.member.nickname}**, there was an error to retrieve video info. \n Attempting to play song anyway. \n **Error**: ${err.message}`);
            videoInfo = {
                video_details: {
                    title: "Title Unavailable"
                }
            };
        }
        try {
            await this.audioPlayer.playMusic(song);
            await interaction.editReply({ content: `🎵 **${videoInfo.video_details.title}** is now being played! 🎵 \n ${song}`, components: [] });
        }
        catch (err) {
            await interaction.editReply(`Hey **${interaction.member.nickname}**, there was an error trying to play the song. \n **Error**: ${err.message} \n ${err.error?.message}`);
            this.audioPlayer.exitVoiceChannel();
            return;
        }
    }
}
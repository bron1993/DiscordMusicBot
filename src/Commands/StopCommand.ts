import { ICommand } from "./ICommand";


export class StopCommand implements ICommand {

    audioPlayer;
    voiceChannel;
    public constructor(audioPlayer, voiceChannel) {
        this.audioPlayer = audioPlayer;
        this.voiceChannel = voiceChannel;
    }

    public async execute(interaction) {
        try {
            await this.audioPlayer.stopMusic();
            await interaction.editReply('Stopping music.');
        }
        catch (err) {
            await interaction.editReply(`Hey **${interaction.member.nickname}**, an error occured when trying to stop playing music. \n **Error**: ${err.message}`);
            return;
        }
    }
}
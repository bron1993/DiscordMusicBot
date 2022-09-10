import { VoiceConnectionStatus, AudioPlayerStatus, createAudioResource, createAudioPlayer, entersState, joinVoiceChannel } from '@discordjs/voice';
import play from 'play-dl';

class AudioPlayer {

    private connection;
    private player;
    constructor() {
        this.player = createAudioPlayer();

    }

    public async connectToVoiceChannel(channel) {
        if (!channel) {
            throw ({ message: "Channel is null" });
        }
        this.connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });
        try {
            await entersState(this.connection, VoiceConnectionStatus.Ready, 30e3);
            return this.connection;
        } catch (error) {
            this.connection.destroy();
            throw error;
        }
    }

    public exitVoiceChannel() {
        if (this.connection) {
            try {
                this.connection.destroy();
            }
            catch (err) {
                console.log("Attempted to destroy connection that was already destroyed");
            }
        }
    }
    public async stopMusic() {
        if (!(this.player.state.status == AudioPlayerStatus.Playing)) {
            throw ({ message: "No music is being played at the moment." });
        }
        this.player.stop();
    }

    public async getVideoInfo(url: string) {
        const videoInfo = await play.video_info(url);

        return videoInfo;
    }
    public async playMusic(url: string) {

        if (!this.verifySongUrl(url)) {
            throw ({ message: "Invalid song URL" });
        }

        this.connection.subscribe(this.player);

        try {
            const resource = await this.createYoutubeResource(url);
            this.player.play(resource);
        }
        catch (err) {
            console.log(err);
            throw {
                message: "Failed to create youtube resource.",
                error: err
            };
        }
        
        await entersState(this.player, AudioPlayerStatus.Playing, 5e3);

        this.player.on(AudioPlayerStatus.Idle, async () => {
            console.log("Song ended, entering idle state.");
            this.exitVoiceChannel();
        });

        return;
    }

    public async createYoutubeResource(url: string) {
        const source = await play.stream(url, { discordPlayerCompatibility: true });
        return createAudioResource(source.stream, {
            inputType: source.type
        })


    }

    private verifySongUrl(url: string) {
        if (url.startsWith('https') && play.yt_validate(url) === 'video') {
            return true;
        }
        return false;


    }

    public async searchSong(query: string) {
        const searched = await play.search(query, { source : { youtube : "video" }, limit: 10})
        const parsed = searched.map(({title, durationRaw, url}) => ({title, durationRaw, url}))
        return parsed;

    }
}
// connection.on(VoiceConnectionStatus.Ready, (oldState, newState) => {
//     console.log('Connection is in the Ready state!');
// });

// player.on(AudioPlayerStatus.Playing, (oldState, newState) => {
//     console.log('Audio player is in the Playing state!');
// });
export default AudioPlayer;
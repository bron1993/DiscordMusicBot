import { PlayCommand } from "./PlayCommand";
import { SearchCommand } from "./SearchCommand";
import { StopCommand } from "./StopCommand";


export class CommandFactory {

    private audioPlayer;
    private voiceChannel;
    constructor(audioPlayer: any, voiceChannel: any) {
        this.audioPlayer = audioPlayer;
        this.voiceChannel = voiceChannel;
    }


    public getCommand(commandName: string) {

        switch (commandName) {
            case ("play"):
                return new PlayCommand(this.audioPlayer, this.voiceChannel);
            case ("stop"):
                return new StopCommand(this.audioPlayer, this.voiceChannel);
            case ("search"):
                return new SearchCommand(this.audioPlayer, this.voiceChannel);
            default:
                throw ("Command not recognized");
        }

    }

}
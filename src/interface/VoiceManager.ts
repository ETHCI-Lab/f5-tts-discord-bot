import { TtsTask } from "./ttsTask.js";
import { AudioPlayer, createAudioPlayer } from '@discordjs/voice';

export interface VoiceManager {

    addToQueue(task: TtsTask): Promise<void>;

    /**
     * clear queue
     */
    clearQueue(): void;
}
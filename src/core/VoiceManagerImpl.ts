import { AudioPlayer, createAudioPlayer, NoSubscriberBehavior, AudioPlayerStatus, createAudioResource, StreamType } from "@discordjs/voice";
import { VoiceManager } from "../interface/VoiceManager.js";
import { sovitsService } from "./SovitsService.js";
import { v4 as uuidv4 } from 'uuid';
import { TtsTask } from "../interface/ttsTask.js";
import path from "path";
import fs from "fs";
import { F5TtsBody, GradioFileDataItem } from "../interface/f5_tts_body.js";

type info = {
    textCognize: string,
    data: GradioFileDataItem
}

/**
 * impl as singleton
 */
export class VoiceManagerImpl implements VoiceManager {
    public readonly id: string;
    /**
     * audio player
     */
    private player: AudioPlayer = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Play,
        },
    });


    private chartersPath = path.join(__dirname, '../config');
    private charterFiles = fs.readdirSync(this.chartersPath).filter(file => file.endsWith('.json'));

    /**
     * task queue
     */
    private queue: TtsTask[] = [];

    /**
     * charter config list
     */
    private charterList: info[] = [];

    constructor() {
        this.id = uuidv4();
        console.log(`[VoiceManager] Instance created. ID: ${this.id}`);

        /**
         * state machine for handling player event
         */
        this.player.on(AudioPlayerStatus.Idle, () => {
            console.log("[VoiceManager] Player is Idle.");
            this.processQueue();
        });

        this.player.on(AudioPlayerStatus.Playing, () => {
            console.log("[VoiceManager] Player is Playing.");
        });

        this.player.on(AudioPlayerStatus.Buffering, () => {
            console.log("[VoiceManager] Player is Buffering.");
        });

        this.player.on('stateChange', (oldState, newState) => {
            console.log(`[VoiceManager] Player State Change: ${oldState.status} -> ${newState.status}`);
        });

        this.player.on('error', error => {
            console.error('Audio Player Error:', error.message);
            this.processQueue();
        });

        this.loadCharterList();
    }

    private loadCharterList(): void {
        for (const file of this.charterFiles) {
            const filePath = path.join(this.chartersPath, file);
            try {
                const charter: { textCognize: string, data: GradioFileDataItem } = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                this.charterList.push(charter);
            } catch (error) {
                console.error(`Error loading charter ${file}: ${error}`);
            }
        }
    }

    private genCharterData(data: GradioFileDataItem, textCognize: string, text: string, session_hash: string, speed: number = 0.9): F5TtsBody {
        const ans: F5TtsBody = {
            data: [
                data,
                textCognize,
                text, false, true, 16030596, 0.15, 32, speed
            ],
            event_data: null,
            fn_index: 7,
            trigger_id: 7,
            session_hash: session_hash
        }
        return ans;
    }


    public async addToQueue(task: TtsTask, index: number = 0): Promise<void> {

        try {
            if (index >= this.charterList.length) {
                index = 0;
            }
            task.charter = this.genCharterData(this.charterList[index].data, this.charterList[index].textCognize, task.text, "0ugnjj28hrs", task.speed);
            task.stream = await sovitsService.synthesize(task.charter);
            this.queue.push(task);
            console.log(`[VoiceManager] Task added. Queue size: ${this.queue.length}. Player status: ${this.player.state.status}`);

            if (this.player.state.status === AudioPlayerStatus.Idle) {
                this.processQueue();
            }
        } catch (error) {
            console.error("[VoiceManager] Synthesis failed:", error);
        }
    }

    private processQueue(): void {
        if (this.queue.length === 0) {
            console.log("[VoiceManager] Queue empty.");
            return;
        }

        const task = this.queue.shift();
        if (task && task.stream) {
            console.log("[VoiceManager] Processing task. Creating AudioResource...");
            try {
                const resource = createAudioResource(task.stream, {
                    inputType: StreamType.Arbitrary,
                    inlineVolume: true
                });
                console.log("[VoiceManager] AudioResource created. Playing...");
                this.player.play(resource);
            } catch (e) {
                console.error("[VoiceManager] Error creating resource or playing:", e);
                this.processQueue();
            }
        }
    }

    public clearQueue(): void {
        this.queue = [];
        this.player.stop();
    }

    public getPlayer(): AudioPlayer {
        return this.player;
    }

    public getQueue(): TtsTask[] {
        return this.queue;
    }
}

export const voiceManager = new VoiceManagerImpl();
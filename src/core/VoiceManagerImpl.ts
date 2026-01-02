import { AudioPlayer, createAudioPlayer, NoSubscriberBehavior, AudioPlayerStatus, createAudioResource, StreamType } from "@discordjs/voice";
import { TtsTask } from "../interface/ttsTask.js";
import { VoiceManager } from "../interface/VoiceManager.js";
import { sovitsService } from "./SovitsService.js";

import { v4 as uuidv4 } from 'uuid';

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

    /**
     * task queue
     */
    private queue: TtsTask[] = [];

    constructor() {
        this.id = uuidv4();
        console.log(`[VoiceManager] Instance created. ID: ${this.id}`);

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
    }

    public async addToQueue(task: TtsTask): Promise<void> {
        try {
            task.stream = await sovitsService.synthesize(task.text);
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
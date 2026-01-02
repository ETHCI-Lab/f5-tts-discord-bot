import { CommandInteraction } from 'discord.js';
import { Readable } from 'stream';
import { F5TtsBody } from './f5_tts_body.js';

/**
 * @param text user input text
 * @param interaction interaction object
 * @param timestamp task create time
 */
export interface TtsTask {
    text: string;
    interaction: CommandInteraction;
    timestamp: number;
    stream: Readable | null;
    charter: F5TtsBody | null;
    speed: number;
}
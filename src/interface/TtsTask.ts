import { CommandInteraction } from 'discord.js';
import { Readable } from 'stream';

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
}
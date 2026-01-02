import { Readable } from 'stream';
import { SovitsConfig } from './SovitsConfig.js';

export interface SovitsService {

    /**
     * call api and return audio stream
     * @param text user input text
     * @returns audio stream
     */
    synthesize(text: string): Promise<Readable>;
}
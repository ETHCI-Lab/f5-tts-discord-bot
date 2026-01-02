import { Readable } from 'stream';
import { SovitsConfig } from './SovitsConfig.js';
import { F5TtsBody } from './f5_tts_body.js';

export interface SovitsService {

    /**
     * call api and return audio stream
     * @param body requst payload 
     * @returns audio stream
     */
    synthesize(body: F5TtsBody): Promise<Readable>;
}
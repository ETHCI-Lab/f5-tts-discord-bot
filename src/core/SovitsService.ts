import axios, { AxiosInstance } from 'axios';
import { Readable } from 'stream';
import { logger } from '../middlewares/log.js';
import { SovitsConfig } from '../interface/SovitsConfig.js';
import { asyncGetStream, asyncPost } from '../utils/fetch.js';
import { F5TtsBody, GradioFileDataItem, GradioFileMeta } from '../interface/f5_tts_body.js';
import { SovitsService } from '../interface/SovitsService.js';

require('dotenv').config()

export class SovitsServiceimpl implements SovitsService {

    private readonly config: SovitsConfig;

    constructor(config: SovitsConfig) {
        this.config = config;
    }

    /**
     * start synthesize
     * @param body requst payload 
     * @returns stream
     */
    public async synthesize(body: F5TtsBody): Promise<Readable> {
        if (!this.config.apiUrl) {
            throw new Error("SOVITS_API_URL is not configured.");
        }

        try {
            const session_hash = '0ugnjj28hrs';

            const event_id = await this.pushToQueue(body);
            const targetUrl = await this.getTaskInfo(session_hash);

            if (targetUrl) {
                const stream = await this.downloadAudio(targetUrl);
                return stream;
            } else {
                throw new Error("Task completed but no output data found.");
            }

        } catch (error: any) {
            logger.error(`[SovitsService] error: ${error}`);
            throw error;
        }
    }

    /**
     * push to current session queue
     * @param text 
     * @returns event_id
     */
    private async pushToQueue(body: F5TtsBody): Promise<string> {
        console.log(`[SovitsService] Pushing to queue: ${JSON.stringify(body)}`);
        const response = await asyncPost(`${this.config.apiUrl}/gradio_api/queue/join?`, body);
        console.log(`[SovitsService] Pushed to queue: ${JSON.stringify(response)}`);
        const event_id = response.event_id;
        return event_id;
    }

    /**
     * get task info
     * @param session_hash 
     * @returns url
     */
    private async getTaskInfo(session_hash: string): Promise<string> {
        const response = await asyncGetStream(`${this.config.apiUrl}/gradio_api/queue/data?session_hash=${session_hash}`);

        if (!response.body) {
            throw new Error("No response body from getTaskInfo");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(line.slice(6));
                        if (data.msg === 'process_completed') {
                            const url = data.output.data[0].url
                            return url;
                        }
                    } catch (e) {
                        logger.error(`[SovitsService] error: ${e}`);
                    }
                }
            }
        }

        let data = response.json()
        console.log(`[SovitsService] getTaskInfo: ${JSON.stringify(data)}`);

        throw new Error("Stream ended without process_completed");
    }

    private async downloadAudio(url: string): Promise<Readable> {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data);
        console.log(`[SovitsService] Downloaded audio size: ${buffer.length} bytes`);

        if (buffer.length > 16) {
            console.log(`[SovitsService] Audio Header (Hex): ${buffer.subarray(0, 16).toString('hex')}`);
        }

        return Readable.from(buffer);
    }
}

export const sovitsService = new SovitsServiceimpl({
    apiUrl: process.env.SOVITS_API_URL as string,
    refAudioPath: process.env.SOVITS_REF_AUDIO_PATH as string,
    promptText: process.env.SOVITS_PROMPT_TEXT as string,
    promptLang: process.env.SOVITS_PROMPT_LANG as string,
});

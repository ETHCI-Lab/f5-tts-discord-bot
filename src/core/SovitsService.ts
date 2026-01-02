import axios, { AxiosInstance } from 'axios';
import { Readable } from 'stream';
import { logger } from '../middlewares/log.js';
import { SovitsConfig } from '../interface/SovitsConfig.js';
import { SovitsService } from '../interface/sovitsService.js';
import { asyncGetStream, asyncPost } from '../utils/fetch.js';
import { PeiyuData, ChaoWeiData, F5TtsBody, GradioFileDataItem, GradioFileMeta } from '../interface/f5_tts_body.js';
require('dotenv').config()

export class SovitsServiceimpl implements SovitsService {

    private readonly config: SovitsConfig;

    constructor(config: SovitsConfig) {
        this.config = config;
    }

    /**
     * start synthesize
     * @param text 
     * @returns stream
     */
    public async synthesize(text: string): Promise<Readable> {
        if (!this.config.apiUrl) {
            throw new Error("SOVITS_API_URL is not configured.");
        }

        try {
            const session_hash = '0ugnjj28hrs';

            const event_id = await this.pushToQueue(text);
            const targetUrl = await this.getTaskInfo(session_hash);

            if (targetUrl) {
                const stream = await this.downloadAudio(targetUrl);
                return stream;
            } else {
                throw new Error("Task completed but no output data found.");
            }

        } catch (error: any) {
            logger.error(`[SovitsService] 錯誤: ${error}`);
            throw error;
        }
    }

    /**
     * push to current session queue
     * @param text 
     * @returns event_id
     */
    private async pushToQueue(text: string): Promise<string> {
        const body: F5TtsBody = {
            data: [
                PeiyuData,
                // "阿寬的講法是他沒有時間陪阿瑟阿瑟不喜歡這種狀況就是分手我也沒有問阿瑟發生什麼事情阿瑟說.",
                "在這門課當中我們將深入的探討到底你需要哪一些網路的裝置哪一些網路的媒介才可以構成一個可以運作的網路.",
                text, false, true, 0, 0.15, 32, 1
            ],
            event_data: null,
            fn_index: 7,
            trigger_id: 7,
            session_hash: '0ugnjj28hrs', // Need a random hash usually
        }

        const response = await asyncPost(`${this.config.apiUrl}/gradio_api/queue/join?`, body);
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
                        // ignore
                    }
                }
            }
        }

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

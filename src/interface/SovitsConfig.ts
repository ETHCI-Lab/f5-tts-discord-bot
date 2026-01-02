/**
 * @param apiUrl sovits api url
 * @param refAudioPath reference audio path
 * @param promptText prompt text
 * @param promptLang prompt language
 */
export interface SovitsConfig {
    readonly apiUrl: string;
    readonly refAudioPath: string;
    readonly promptText: string;
    readonly promptLang: string;
}

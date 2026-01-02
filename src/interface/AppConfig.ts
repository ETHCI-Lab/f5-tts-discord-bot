import { SovitsConfig } from "./SovitsConfig.js";

export interface AppConfig {
    readonly discordToken: string;
    readonly logLevel: string;
    readonly sovits: SovitsConfig;
    readonly queueLimit: number;
}
import { Message } from 'discord.js';

export interface CommandRouter {
    /**
     * dispatch message to command handler
     * @param message message object
     */
    dispatch(message: Message): Promise<void>;
}
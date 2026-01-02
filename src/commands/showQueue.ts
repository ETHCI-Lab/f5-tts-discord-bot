import { CommandInteraction } from "discord.js";
import { Command } from "../interface/Command.js";
import { voiceManager } from "../core/VoiceManagerImpl.js";
const { SlashCommandBuilder } = require('discord.js');

const showQueueImpl = async (interaction: CommandInteraction): Promise<void> => {
    const queue = voiceManager.getQueue();
    if (queue.length) {
        let queueText = queue.map((task, index) => `${index + 1}. ${task.text}`).join('\n');
        queueText = queueText.toString()

        await interaction.reply({ content: queueText, ephemeral: true });
    } else {
        await interaction.reply({ content: 'Queue is empty', ephemeral: true });
    }
}

export const showQueue: Command = {
    data: new SlashCommandBuilder().setName('show-queue').setDescription('show tts queue'),
    execute: showQueueImpl
}
import { CommandInteraction, SlashCommandStringOption, VoiceChannel } from "discord.js";
import { Command } from "../interface/Command.js";
import { joinVoiceChannel, VoiceConnectionStatus } from '@discordjs/voice';
import { logger } from "../middlewares/log.js";
import { voiceManager } from "../core/VoiceManagerImpl.js";
const { SlashCommandBuilder } = require('discord.js');

const ttsImpl = async (interaction: CommandInteraction): Promise<void> => {
    //@ts-ignore
    const prompt = interaction.options.getString('prompt');
    if (!prompt) {
        await interaction.reply({ content: '請提供提示詞', ephemeral: true });
        return;
    }
    voiceManager.addToQueue({
        text: prompt,
        interaction: interaction,
        timestamp: Date.now(),
        stream: null
    })

    await interaction.reply({ content: '已加入隊列', ephemeral: true });
}

export const tts: Command = {
    data: new SlashCommandBuilder().setName('tts').setDescription('push tts task')
        .addStringOption((option: SlashCommandStringOption) => option.setName('prompt').setDescription('prompt').setRequired(true)),
    execute: ttsImpl
}
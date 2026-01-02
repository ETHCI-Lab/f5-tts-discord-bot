import { CommandInteraction, SlashCommandNumberOption, SlashCommandStringOption } from "discord.js";
import { Command } from "../interface/Command.js";
import { voiceManager } from "../core/VoiceManagerImpl.js";
const { SlashCommandBuilder } = require('discord.js');

const ttsImpl = async (interaction: CommandInteraction): Promise<void> => {
    //@ts-ignore
    const prompt = interaction.options.getString('prompt');
    //@ts-ignore
    const index = interaction.options.getNumber('index');
    //@ts-ignore
    const speed = interaction.options.getNumber('speed');

    if (!prompt) {
        await interaction.reply({ content: '請提供提示詞', ephemeral: true });
        return;
    }
    voiceManager.addToQueue({
        text: prompt,
        interaction: interaction,
        timestamp: Date.now(),
        stream: null,
        charter: null,
        speed: speed ? speed : 0.9
    }, index)

    await interaction.reply({ content: '已加入隊列', ephemeral: true });
}

export const tts: Command = {
    data: new SlashCommandBuilder().setName('tts').setDescription('push tts task')
        .addStringOption((option: SlashCommandStringOption) => option.setName('prompt').setDescription('prompt').setRequired(true))
        .addNumberOption((option: SlashCommandNumberOption) => option.setName('index').setDescription('charter index').setRequired(false))
        .addNumberOption((option: SlashCommandNumberOption) => option.setName('speed').setDescription('speech speed').setRequired(false)),
    execute: ttsImpl
}
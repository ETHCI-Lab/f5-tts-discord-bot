import { CommandInteraction } from "discord.js";
import { Command } from "../interface/Command.js";
import { createAudioResource, StreamType } from '@discordjs/voice';
import { voiceManager } from "../core/VoiceManagerImpl.js";
const { SlashCommandBuilder } = require('discord.js');

const debugImpl = async (interaction: CommandInteraction): Promise<void> => {
    await interaction.reply({ content: 'Playing debug audio...', ephemeral: true });

    // Play a known working short MP3 file
    const debugUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

    const resource = createAudioResource(debugUrl, {
        inputType: StreamType.Arbitrary,
        inlineVolume: true
    });

    const player = voiceManager.getPlayer();
    player.play(resource);
}

export const debug: Command = {
    data: new SlashCommandBuilder().setName('debug').setDescription('Play debug audio to test connection'),
    execute: debugImpl
}

import { CommandInteraction, VoiceChannel } from "discord.js";
import { Command } from "../interface/Command.js";
import { getVoiceConnection, VoiceConnectionStatus } from '@discordjs/voice';
import { logger } from "../middlewares/log.js";
import { voiceManager } from "../core/VoiceManagerImpl.js";
const { SlashCommandBuilder } = require('discord.js');

const leaveImpl = async (interaction: CommandInteraction): Promise<void> => {

    if (interaction.member) {

        //@ts-ignore
        const voiceChannel: VoiceChannel = interaction.member.voice.channel;
        const connection = getVoiceConnection(voiceChannel.guild.id);

        if (connection) {
            voiceManager.clearQueue();
            connection.destroy(); // destroy() is preferred over disconnect() for full cleanup
            await interaction.reply({ content: 'Leave the voice channel', ephemeral: true });
        } else {
            //@ts-ignore
            await interaction.reply({ content: 'no connection', ephemeral: true });
        }

    } else {
        await interaction.reply({ content: 'You are not in a voice channel', ephemeral: true });
        return;
    }

}

export const leave: Command = {
    data: new SlashCommandBuilder().setName('leave').setDescription('Leave the voice channel'),
    execute: leaveImpl
}


import { CommandInteraction, VoiceChannel } from "discord.js";
import { Command } from "../interface/Command.js";
import { joinVoiceChannel, VoiceConnectionStatus } from '@discordjs/voice';
import { logger } from "../middlewares/log.js";
import { voiceManager } from "../core/VoiceManagerImpl.js";
const { SlashCommandBuilder } = require('discord.js');

const joinImpl = async (interaction: CommandInteraction): Promise<void> => {
    //@ts-ignore
    const voiceChannel: VoiceChannel = interaction.member.voice.channel
    if (voiceChannel && interaction.guild) {

        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: interaction.guildId as string,
            //@ts-ignore
            adapterCreator: interaction.guild.voiceAdapterCreator
        })

        connection.subscribe(voiceManager.getPlayer());

        await interaction.reply(`加入頻道: ${voiceChannel.name}`);

        connection.on("error", (error) => {
            logger.error(`[Connection] Error: ${error.message}`);
        });

        connection.on(VoiceConnectionStatus.Ready, () => {
            console.log("[Connection] Status: Ready - Connection established and ready to play audio!");
        });

        connection.on(VoiceConnectionStatus.Signalling, () => {
            console.log("[Connection] Status: Signalling");
        });

        connection.on(VoiceConnectionStatus.Connecting, () => {
            console.log("[Connection] Status: Connecting");
        });

        connection.on(VoiceConnectionStatus.Disconnected, () => {
            console.log("[Connection] Status: Disconnected");
        });

    } else {
        await interaction.reply("不在頻道");
    }

}

export const join: Command = {
    data: new SlashCommandBuilder().setName('join').setDescription('Join the voice channel'),
    execute: joinImpl
}
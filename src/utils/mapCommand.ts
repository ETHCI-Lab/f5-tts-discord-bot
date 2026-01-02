import { Client, Events } from "discord.js";
import { logger } from "../middlewares/log.js";
import { response } from "../interface/response.js";

type commands = {
    [key: string]: any;
}

export const mapCommand = (client: Client, command: commands) => {
    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;

        const target = command[interaction.commandName];

        if (!target) {
            logger.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await target.execute(interaction);
        } catch (error) {
            logger.error(error);
            const temp: response<string> = {
                code: "501",
                message: "伺服器錯誤",
                body: JSON.stringify(error)
            }
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: JSON.stringify(temp), ephemeral: true });
            } else {
                await interaction.reply({ content: JSON.stringify(temp), ephemeral: true });
            }
        }
    });

}
import path from "path";
import fs from "fs";
import { REST, Routes } from "discord.js";
import { logger } from "./middlewares/log.js";
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { Command } from "./interface/Command.js";
dotenv.config();

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type CommandDic = {
    [key: string]: Command
}

export const commandRegi = async (rest: REST): Promise<CommandDic> => {
    // Looks for commands in src/commands
    const commandsPath = path.join(__dirname, 'commands');

    if (!fs.existsSync(commandsPath)) {
        logger.error(`Commands directory not found at ${commandsPath}`);
        return {};
    }

    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
    const commands: any[] = [];
    const commandDic: CommandDic = {};

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        try {
            // Dynamic import for ESM/Vite support
            const module = await import(filePath);

            // Find the exported Command object (handling named exports)
            const command = Object.values(module).find((exp: any) => exp?.data && exp?.execute) as Command | undefined;

            if (command) {
                commands.push(command.data.toJSON());

                commandDic[command.data.name] = {
                    data: command.data,
                    execute: command.execute
                }
            } else {
                logger.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
            }
        } catch (error) {
            logger.error(`Error loading command ${file}: ${error}`);
        }
    }

    /**
     * wait for command register
     */
    try {
        if (!process.env.CLIENT_ID) {
            logger.error("Missing CLIENT_ID");
        } else {
            const data = await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
            logger.info(`Successfully reloaded ${(data as any[]).length} application (/) commands.`);
        }
    } catch (error) {
        logger.error(`Failed to register commands: ${error}`);
    }

    return commandDic;
}
import { Client, Collection, Events, GatewayIntentBits, REST, Routes } from 'discord.js';
import { generateDependencyReport } from '@discordjs/voice';
console.log(generateDependencyReport());
import { logger } from './middlewares/log.js';
import { commandRegi } from './commandRegister.js';
import { mapCommand } from './utils/mapCommand.js';
require('dotenv').config()

const main = async () => {

  const rest = new REST({ version: '10' }).setToken(process.env.BOTTOKEN as string);
  const client: Client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

  client.login(process.env.BOTTOKEN as string);

  client.once('ready', async () => {
    logger.info(`Logged in as ${client.user?.tag}!`);
    const commandDic = await commandRegi(rest);
    mapCommand(client, commandDic);
  });
}

main();

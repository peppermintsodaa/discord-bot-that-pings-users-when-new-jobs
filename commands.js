import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import { CLIENT_ID, TOKEN } from './env.js';

const commands = [
  {
    name: 'ping',
    description: 'Check status of bot',
  },
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

try {
  console.log('Started refreshing application (/) commands.');

  await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}
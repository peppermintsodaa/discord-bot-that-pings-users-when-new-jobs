import { REST, Routes } from 'discord.js';
import { SERVER_ID, TOKEN } from './env.js';
import config from './config.js';

const rest = new REST({ version: '10' }).setToken(TOKEN);

export const deployCommands = async (clientId, commands) => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(clientId), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
};

export const retriveChannelAndRoleInfo = async (client) => {
  const idMappings = {
    pingChannel: '',
    jobBoards: {},
    jobPingRoles: {}
  };

  try {
    const { channels, roles } = await client.guilds
      .fetch(SERVER_ID)
      .then(async (guild) => {
        const channels = await guild.channels.fetch();
        const roles = await guild.roles.fetch();

        return { channels, roles };
      });

    // get id for job ping channel
    idMappings.pingChannel = channels.find(
      (c) => c.name === config.pingChannel
    ).id;

    // get ids for job boards
    const jobBoardThreads = channels.filter((c) =>
      config.jobThreads.includes(c.name)
    );
    config.jobThreads.forEach((jt) => {
      idMappings.jobBoards[jt] = jobBoardThreads.find((j) => j.name === jt).id;
    });

    // get ids for roles
    const relevantRoles = roles.filter((r) =>
      config.jobPingRoles.includes(r.name)
    );
    config.jobPingRoles.forEach((jr) => {
      idMappings.jobPingRoles[jr] = relevantRoles.find((r) => r.name === jr).id;
    });

    return idMappings;
  } catch (error) {
    console.error(error);
  }
};

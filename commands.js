import { REST, Routes } from 'discord.js';
import { TOKEN } from './env.js';
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
}

export const retriveChannelAndRoleInfo = async (client) => {
  const idMappings = {
    pingChannel: '',
    jobBoards: {},
    jobPingRoles: {},
  }

  try {
    const channels = await client.guild.channels.fetch();
    const roles = await client.guild.roles.fetch();

    // get id for job ping channel
    idMappings.jobPingChannel = channels.filter((c) => c.name === config.pingChannel).at(0).id;

    // get ids for job boards
    const jobBoardThreads = channels.filter((c) => config.jobThreads.includes(c.name));
    config.jobThreads.forEach((jt) => {
      idMappings.jobBoards[jt] = jobBoardThreads.filter((j) => j.name === jt).at(0).id;
    });

    // get ids for roles
    const relevantRoles = roles.filter((r) => config.jobRoles.includes(r.name));
    config.jobRoles.forEach((jr) => {
      idMappings.jobPingRoles[jr] = relevantRoles.filter((r) => r.name === jr).at(0).id;
    });

    return idMappings;
  } catch (error) {
    console.error(error);
  }
}
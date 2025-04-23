import { Client, Events, GatewayIntentBits } from 'discord.js';
import { CLIENT_ID, TOKEN } from './env.js';
import { deployCommands, retriveChannelAndRoleInfo } from './commands.js';
import config from './config.js';

const commands = [
  {
    name: 'ping',
    description: 'Check status of bot',
  },
];

// deploy/reload commands before starting
deployCommands(CLIENT_ID, commands);

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent ] });

client.once(Events.ClientReady, () => {
	console.log(`Bot is up! Current uptime is at ${new Date()}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    const startTime = Date.now();
    
    await interaction.reply(`Pong! Bot responded in ${Date.now() - startTime}ms`);
  }
});

client.on(Events.ThreadCreate, async (thread) => {
  // if thread was not made in the job board channels
  if (!config.jobThreads.includes(thread.name)) return;

  // retrieve appropriate IDs
  const { pingChannel, jobBoards, jobPingRoles } = await retriveChannelAndRoleInfo(client);

  // retrieve info about job ping channel
  const jobPingChannel = await client.channels.fetch(pingChannel);

  // retrieve relevant tag to ping users by
  const relevantTags = thread.appliedTags.filter((tag) => {
    const tagLower = tag.name.toLowerCase();
    
    return tagLower.includes('intern') 
    || tagLower.includes('student')
    || tagLower.includes('grad') 
    || tagLower.includes('junior') 
    || tagLower.includes('experience');
  });

  // append pinging role to message
  let rolesToPing = '';
  relevantTags.forEach((tag) => {
    const tagLower = tag.name.toLowerCase();
    let roleName = '';

    if (tagLower.includes('intern') || tagLower.includes('student')) {
      roleName = 'intern';
    }
    if (tagLower.includes('grad')) {
      roleName = 'grad';
    }
    if (tagLower.includes('junior')) {
      roleName = 'junior';
    }
    if (tagLower.includes('experience')) {
      roleName = 'experience';
    }

    const role = Object.keys(jobPingRoles).filter((r) => r.includes(roleName));
    rolesToPing += `<@&${jobPingRoles[role]}> `;
  })

  // retrieve ID for opportunities channels
  const opportunityIds = Object.keys(jobBoards).filter((b) => b.includes('opportunit'));

  // send message
  const message = `## 🗞️ **HEAR HEAR!** 🗞️
  ### ${opportunityIds.includes(thread.parentId) ? 'OPPORTUNITIES' : 'OPENINGS'} FOR ${thread.name.toUpperCase()} ARE HERE!
  
  ${rolesToPing}https://discord.com/channels/${thread.parentId}/${thread.id}`;

  jobPingChannel.send(message)
    .then(console.log)
    .catch(console.error);
})

// log in to Discord
client.login(TOKEN);

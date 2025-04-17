import { Client, Events, GatewayIntentBits } from 'discord.js';
import { TOKEN } from './env.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    const startTime = Date.now();
    
    await interaction.reply(`Pong! Bot responded in ${Date.now() - startTime}ms`);
  }
});

// Log in to Discord with your client's token
client.login(TOKEN);

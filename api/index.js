const { Client, GatewayIntentBits, Collection } = require('discord.js');
const path = require('path');
const fs = require('fs');

let client;

async function initializeBot() {
    if (client) return client;

    client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
        ],
    });

    client.commands = new Collection();

    const commandsPath = path.join(__dirname, '..', 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('name' in command && 'execute' in command) {
            client.commands.set(command.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "name" or "execute" property.`);
        }
    }

    client.once('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
        client.user.setPresence({
            status: 'idle',
            activities: [{
                name: 'NEW TECH TRENDS',
                type: 'WATCHING',
            }],
        });
    });

    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
        }
    });

    await client.login(process.env.DISCORD_BOT_TOKEN);
    return client;
}

let lastPingTime = Date.now();

module.exports = async (req, res) => {
    try {
        if (!client || Date.now() - lastPingTime > 60000) { // Reinitialize every minute
            client = await initializeBot();
            lastPingTime = Date.now();
        }
        res.status(200).send(`Bot is running! Last ping: ${new Date(lastPingTime).toISOString()}`);
    } catch (error) {
        console.error('Error in serverless function:', error);
        res.status(500).send('Internal Server Error');
    }
};

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const path = require('path');
const fs = require('fs');

let client;

function initializeBot() {
    if (client) return;

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

    client.on('ready', () => {
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

        if (!interaction.inGuild()) {
            await interaction.reply("This bot only works in servers, not private messages.");
            return;
        }

        const command = client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Error executing command ${interaction.commandName}:`, error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: 'An error occurred while processing your request.', ephemeral: true });
            } else if (interaction.deferred) {
                await interaction.editReply({ content: 'An error occurred while processing your request.' });
            }
        }
    });

    client.login(process.env.DISCORD_BOT_TOKEN);
}

module.exports = async (req, res) => {
    try {
        if (!client) {
            initializeBot();
        }
        res.status(200).send('Bot is running!');
    } catch (error) {
        console.error('Error in serverless function:', error);
        res.status(500).send('Internal Server Error');
    }
};

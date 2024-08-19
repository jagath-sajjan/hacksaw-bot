if (typeof globalThis.ReadableStream === 'undefined') {
    const { ReadableStream } = require('stream/web');
    globalThis.ReadableStream = ReadableStream;
}

const { 
    Client, 
    GatewayIntentBits, 
    Collection,
    REST,
    Routes
} = require('discord.js');

const axios = require('axios');
const { exec } = require('node:child_process');
const crypto = require('crypto');
const GIFEncoder = require('gifencoder');
const { createCanvas } = require('canvas');
const { format, utcToZonedTime } = require('date-fns-tz');
const QRCode = require('qrcode');
const express = require('express');
const giphy = require('giphy-api')
const https = require('https');
const path = require('path');
const fetch = require('node-fetch');
const figlet = require('figlet');
const fs = require('fs');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.commands = new Collection();

// Function to recursively read command files
function readCommands(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
        const filePath = path.join(dir, file.name);
        if (file.isDirectory()) {
            readCommands(filePath);
        } else if (file.name.endsWith('.js')) {
            try {
                const command = require(filePath);
                if ('name' in command && 'execute' in command) {
                    client.commands.set(command.name, command);
                    console.log(`Loaded command: ${command.name}`);
                } else {
                    console.log(`[WARNING] The command at ${filePath} is missing a required "name" or "execute" property.`);
                }
            } catch (error) {
                console.error(`[ERROR] Failed to load command at ${filePath}:`, error);
            }
        }
    }
}

// Read all command files
const commandsPath = path.join(__dirname, 'commands');
readCommands(commandsPath);

function pingServer() {
    https.get('https://morse-w4z7.onrender.com', (resp) => {
        console.log('Ping successful');
    }).on('error', (err) => {
        console.log('Ping failed: ' + err.message);
    });
}

// Ping every 14 minutes
setInterval(pingServer, 14 * 60 * 1000);

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    // Set bot status to idle
    client.user.setPresence({
        status: 'idle',
        activities: [{
            name: 'NEW TECH TRENDS',
            type: 'WATCHING',
        }],
    });

    try {
        const commands = [...client.commands.values()];
        const rest = new REST({ version: '9' }).setToken(client.token);
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands }
        );
        console.log('Successfully registered application commands.');
    } catch (error) {
        console.error('Error registering slash commands:', error);
    }
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

const app = express();
const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Morse app listening on port ${port}`);
});

client.login(process.env.DISCORD_BOT_TOKEN);

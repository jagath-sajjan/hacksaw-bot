if (typeof globalThis.ReadableStream === 'undefined') {
    const { ReadableStream } = require('stream/web');
    globalThis.ReadableStream = ReadableStream;
}

const { 
    Client, 
    GatewayIntentBits, 
    EmbedBuilder, 
    ApplicationCommandOptionType, 
    AttachmentBuilder, 
    REST,
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle
} = require('discord.js');

const axios = require('axios');
const { exec } = require('node:child_process');
const crypto = require('crypto');
const GIFEncoder = require('gifencoder');
const { createCanvas } = require('canvas');
const { Routes } = require('discord-api-types/v9');
const { format, utcToZonedTime } = require('date-fns-tz');
const QRCode = require('qrcode');
const express = require('express');
const giphy = require('giphy-api')('zSZRgLmqchF9XkNlDIaoXEt4xY6xK7ho');
const https = require('https');
const path = require('path');
const fetch = require('node-fetch');
const figlet = require('figlet');
const fs = require('fs');

const footerText = 'Made By Jagath🩵';

const wordList = fs.readFileSync('words_alpha.txt', 'utf-8').split('\n').map(word => word.trim().toLowerCase());

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

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
            type: 'WATCHING', // You can choose from PLAYING, STREAMING, LISTENING, WATCHING
        }],
    });

    try {
        const rest = new REST({ version: '9' }).setToken(client.token);
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: [
                {
                    name: 'ping',
                    description: 'Show bot latency'
                },
                {
                    name: 'help',
                    description: 'Show all available commands'
                },
                {
                    name: 'botinfo',
                    description: 'Show information about the bot'
                },
                {
                    name: 'qr',
                    description: 'Generate a QR code',
                    options: [
                        {
                            name: 'type',
                            type: ApplicationCommandOptionType.String,
                            description: 'Type of content (upi, paypal, or other)',
                            required: true,
                            choices: [
                                { name: 'UPI', value: 'upi' },
                                { name: 'PayPal', value: 'paypal' },
                                { name: 'Other', value: 'other' }
                            ]
                        },
                        {
                            name: 'content',
                            type: ApplicationCommandOptionType.String,
                            description: 'The content to encode in the QR code',
                            required: true
                        }
                    ]
                },
                {
                    name: 'coin-flip',
                    description: 'Flip a coin'
                },
                {
                    name: 'roll',
                    description: 'Roll a die',
                    options: [
                        {
                            name: 'sides',
                            type: ApplicationCommandOptionType.Integer,
                            description: 'Number of sides on the die',
                            required: true
                        }
                    ]
                },
                {
                    name: 'gif',
                    description: 'Search for a GIF',
                    options: [
                        {
                            name: 'keyword',
                            type: ApplicationCommandOptionType.String,
                            description: 'The keyword to search for',
                            required: true
                        }
                    ]
                },
                {
                    name: 'ascii',
                    description: 'Generate ASCII art from text',
                    options: [
                        {
                            name: 'text',
                            type: ApplicationCommandOptionType.String,
                            description: 'The text to convert to ASCII art',
                            required: true
                        }
                    ]
                },
                {
                    name: 'dic',
                    description: 'Look up definitions for words',
                    options: [
                        {
                            name: 'word',
                            type: ApplicationCommandOptionType.String,
                            description: 'The word to look up',
                            required: true
                        }
                    ]
                },
                {
                    name: 'anagram',
                    description: 'Find anagrams for a given word or phrase',
                    options: [
                        {
                            name: 'input',
                            type: ApplicationCommandOptionType.String,
                            description: 'The word or phrase to find anagrams for',
                            required: true
                        }
                    ]
                },
                {
                    name: 'morse',
                    description: 'Convert text to Morse code',
                    options: [
                        {
                            name: 'text',
                            type: ApplicationCommandOptionType.String,
                            description: 'The text to convert to Morse code',
                            required: true
                        }
                    ]
                },
                {
                    name: 'convert',
                    description: 'Convert between different units',
                    options: [
                        {
                            name: 'value',
                            type: ApplicationCommandOptionType.Number,
                            description: 'The value to convert',
                            required: true
                        },
                        {
                            name: 'from',
                            type: ApplicationCommandOptionType.String,
                            description: 'The unit to convert from',
                            required: true,
                            choices: [
                                { name: 'Meters', value: 'm' },
                                { name: 'Kilometers', value: 'km' },
                                { name: 'Centimeters', value: 'cm' },
                                { name: 'Millimeters', value: 'mm' },
                                { name: 'Inches', value: 'in' },
                                { name: 'Feet', value: 'ft' },
                                { name: 'Yards', value: 'yd' },
                                { name: 'Miles', value: 'mi' },
                                { name: 'Kilograms', value: 'kg' },
                                { name: 'Grams', value: 'g' },
                                { name: 'Milligrams', value: 'mg' },
                                { name: 'Pounds', value: 'lb' },
                                { name: 'Ounces', value: 'oz' },
                                { name: 'Celsius', value: 'c' },
                                { name: 'Fahrenheit', value: 'f' }
                            ]
                        },
                        {
                            name: 'to',
                            type: ApplicationCommandOptionType.String,
                            description: 'The unit to convert to',
                            required: true,
                            choices: [
                                { name: 'Meters', value: 'm' },
                                { name: 'Kilometers', value: 'km' },
                                { name: 'Centimeters', value: 'cm' },
                                { name: 'Millimeters', value: 'mm' },
                                { name: 'Inches', value: 'in' },
                                { name: 'Feet', value: 'ft' },
                                { name: 'Yards', value: 'yd' },
                                { name: 'Miles', value: 'mi' },
                                { name: 'Kilograms', value: 'kg' },
                                { name: 'Grams', value: 'g' },
                                { name: 'Milligrams', value: 'mg' },
                                { name: 'Pounds', value: 'lb' },
                                { name: 'Ounces', value: 'oz' },
                                { name: 'Celsius', value: 'c' },
                                { name: 'Fahrenheit', value: 'f' }
                            ]
                        }
                   ]
                },
                {
                    name: 'demorse',
                    description: 'Convert Morse code to text',
                    options: [
                        {
                            name: 'morse',
                            type: ApplicationCommandOptionType.String,
                            description: 'The Morse code to convert to text',
                            required: true
                        }
                    ]
                },
                {
                    name: 'ligmorse',
                    description: 'Show Morse code with a visual display',
                    options: [
                        {
                            name: 'input',
                            type: ApplicationCommandOptionType.String,
                            description: 'Text or Morse code to display',
                            required: true
                        }
                    ]
                },
                {
                    name: 'smorse',
                    description: 'Play Morse code audio',
                    options: [
                        {
                            name: 'input',
                            type: ApplicationCommandOptionType.String,
                            description: 'Text or Morse code to play',
                            required: true
                        }
                    ]
                },
                {
                    name: 'learn',
                    description: 'Learn Morse code'
                },
                {
                    name: 'fact',
                    description: 'Get a random fact'
                },
                {
                    name: 'time',
                    description: 'Get the current time in any timezone',
                    options: [
                        {
                            name: 'timezone',
                            type: ApplicationCommandOptionType.String,
                            description: 'The timezone to get the time for',
                            required: true,
                            choices: [
                                { name: 'UTC', value: 'UTC' },
                                { name: 'EST (Eastern Time)', value: 'America/New_York' },
                                { name: 'PST (Pacific Time)', value: 'America/Los_Angeles' },
                                { name: 'IST (Indian Standard Time)', value: 'Asia/Kolkata' },
                                { name: 'JST (Japan Standard Time)', value: 'Asia/Tokyo' },
                                { name: 'AEST (Australian Eastern Standard Time)', value: 'Australia/Sydney' },
                                { name: 'GMT (Greenwich Mean Time)', value: 'Europe/London' },
                                { name: 'CET (Central European Time)', value: 'Europe/Paris' },
                            ]
                        }
                    ]
                },
                {
                    name: 'ip',
                    description: 'Fetch information about a given IP address',
                    options: [
                        {
                            name: 'address',
                            type: ApplicationCommandOptionType.String,
                            description: 'The IP address to look up',
                            required: true
                        }
                    ]
                },
                {
                    name: 'pass-gen',
                    description: 'Generate a secure random password',
                    options: [
                        {
                            name: 'length',
                            type: ApplicationCommandOptionType.Integer,
                            description: 'Length of the password (default: 12, min: 8, max: 128)',
                            required: false,
                        },
                        {
                            name: 'uppercase',
                            type: ApplicationCommandOptionType.Boolean,
                            description: 'Include uppercase letters (default: true)',
                            required: false,
                        },
                        {
                            name: 'lowercase',
                            type: ApplicationCommandOptionType.Boolean,
                            description: 'Include lowercase letters (default: true)',
                            required: false,
                        },
                        {
                            name: 'numbers',
                            type: ApplicationCommandOptionType.Boolean,
                            description: 'Include numbers (default: true)',
                            required: false,
                        },
                        {
                            name: 'symbols',
                            type: ApplicationCommandOptionType.Boolean,
                            description: 'Include symbols (default: true)',
                            required: false,
                        }
                    ]
                }
            ] },
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

    const command = interaction.commandName;

    try {
        switch (command) {
            case 'ping':
                await handlePing(interaction);
                break;
            case 'help':
                await handleHelp(interaction);
                break;
            case 'botinfo':
                await handleBotInfo(interaction);
                break;    
            case 'qr':
                await handleQR(interaction);
                break;
            case 'coin-flip':
                await handleCoinFlip(interaction);
                break;
            case 'roll':
                await handleRoll(interaction);
                break;
            case 'gif':
                await handleGif(interaction);
                break;    
            case 'dic':
                await handleDictionary(interaction);
                break;
            case 'anagram':
                await handleAnagram(interaction);
                break;    
            case 'convert':
                await handleConvert(interaction);
                break;        
            case 'morse':
                await handleMorse(interaction);
                break;
            case 'ascii':
                await handleAscii(interaction);
                break;    
            case 'demorse':
                await handleDemorse(interaction);
                break;
            case 'ligmorse':
                await handleLightMorse(interaction);
                break;
            case 'smorse':
                await handleSoundMorse(interaction);
                break;
            case 'learn':
                await handleLearn(interaction);
                break;    
            case 'time':
                await handleTime(interaction);
                break;
            case 'fact':
                await handleFact(interaction);
                break;          
            case 'ip':
                await handleIPLookup(interaction);
                break;
            case 'pass-gen':
                await handlePasswordGeneration(interaction);
                break;    
            default:
                await interaction.reply('Unknown command');
        }
    } catch (error) {
        console.error(`Error executing command ${command}:`, error);
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({ content: 'An error occurred while processing your request.', ephemeral: true });
        } else if (interaction.deferred) {
            await interaction.editReply({ content: 'An error occurred while processing your request.' });
        }
    }
});

async function handlePasswordGeneration(interaction) {
    await interaction.deferReply({ ephemeral: true });
    try {
        const length = interaction.options.getInteger('length') || 12;
        const uppercase = interaction.options.getBoolean('uppercase') ?? true;
        const lowercase = interaction.options.getBoolean('lowercase') ?? true;
        const numbers = interaction.options.getBoolean('numbers') ?? true;
        const symbols = interaction.options.getBoolean('symbols') ?? true;

        if (length < 8 || length > 128) {
            await interaction.editReply('Password length must be between 8 and 128 characters.');
            return;
        }

        const password = generatePassword(length, uppercase, lowercase, numbers, symbols);

        const embed = new EmbedBuilder()
            .setTitle('Password Generator')
            .setDescription(`Here's your generated password:`)
            .addFields({ name: 'Password', value: `||${password}||` })
            .setColor('Green')
            .setFooter({ text: footerText });

        await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        console.error('Error in handlePasswordGeneration:', error);
        await interaction.editReply('An error occurred while generating the password.');
    }
}

async function handleTime(interaction) {
    await interaction.deferReply();
    try {
        const timezone = interaction.options.getString('timezone');
        const now = new Date();
        const zonedTime = utcToZonedTime(now, timezone);
        const currentTime = format(zonedTime, 'MMMM dd, yyyy HH:mm:ss zzz', { timeZone: timezone });

        const embed = new EmbedBuilder()
            .setTitle(`Current Time in ${timezone}`)
            .setDescription(`The current time is: **${currentTime}**`)
            .setColor('Green')
            .setFooter({ text: footerText });

        await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        console.error('Error in handleTime:', error);
        await interaction.editReply('An error occurred while fetching the time.');
    }
}

function generatePassword(length, uppercase, lowercase, numbers, symbols) {
    let charset = '';
    if (uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers) charset += '0123456789';
    if (symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (charset === '') {
        charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    }

    let password = '';
    const randomBytes = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
        password += charset[randomBytes[i] % charset.length];
    }
    return password;
}

async function handleGif(interaction) {
    await interaction.deferReply();
    try {
        const keyword = interaction.options.getString('keyword');
        console.log(`Searching for GIF with keyword: ${keyword}`);

        // Use axios instead of giphy-api package
        const apiKey = 'zSZRgLmqchF9XkNlDIaoXEt4xY6xK7ho'; // Your Giphy API key
        const response = await axios.get(`https://api.giphy.com/v1/gifs/search`, {
            params: {
                api_key: apiKey,
                q: keyword,
                limit: 1
            }
        });

        console.log('Giphy API response status:', response.status);
        console.log('Giphy API response data:', JSON.stringify(response.data, null, 2));

        if (response.data && response.data.data && response.data.data.length > 0) {
            const gifUrl = response.data.data[0].images.original.url;
            console.log(`Found GIF URL: ${gifUrl}`);

            const embed = new EmbedBuilder()
                .setTitle(`GIF Search: ${keyword}`)
                .setImage(gifUrl)
                .setColor('Random')
                .setFooter({ text: footerText });

            await interaction.editReply({ embeds: [embed] });
        } else {
            console.log(`No GIFs found for keyword: ${keyword}`);
            await interaction.editReply(`No GIFs found for "${keyword}". Please try a different search term.`);
        }
    } catch (error) {
        console.error('Error in handleGif:', error.message);
        if (error.response) {
            console.error('Error response:', error.response.data);
            console.error('Error status:', error.response.status);
        } else if (error.request) {
            console.error('Error request:', error.request);
        }
        console.error('Error stack:', error.stack);

        let errorMessage = 'An error occurred while searching for the GIF. ';
        if (error.response && error.response.status === 403) {
            errorMessage += 'API key may be invalid. Please contact the bot administrator.';
        } else if (error.code === 'ECONNABORTED') {
            errorMessage += 'The request timed out. Please try again later.';
        } else {
            errorMessage += 'Please try again later.';
        }

        await interaction.editReply(errorMessage);
    }
}

async function handleIPLookup(interaction) {
    await interaction.deferReply();
    try {
        const ipAddress = interaction.options.getString('address');
        const response = await fetch(`http://ip-api.com/json/${ipAddress}`);
        const data = await response.json();

        if (data.status === 'success') {
            const embed = new EmbedBuilder()
                .setTitle(`IP Information: ${ipAddress}`)
                .addFields(
                    { name: 'Country', value: data.country || 'N/A', inline: true },
                    { name: 'Region', value: data.regionName || 'N/A', inline: true },
                    { name: 'City', value: data.city || 'N/A', inline: true },
                    { name: 'ZIP', value: data.zip || 'N/A', inline: true },
                    { name: 'Latitude', value: data.lat?.toString() || 'N/A', inline: true },
                    { name: 'Longitude', value: data.lon?.toString() || 'N/A', inline: true },
                    { name: 'ISP', value: data.isp || 'N/A', inline: true },
                    { name: 'Organization', value: data.org || 'N/A', inline: true },
                    { name: 'AS', value: data.as || 'N/A', inline: true },
                    { name: 'Timezone', value: data.timezone || 'N/A', inline: true }
                )
                .setColor('Green')
                .setFooter({ text: footerText });

            await interaction.editReply({ embeds: [embed] });
        } else {
            await interaction.editReply(`Failed to fetch information for IP: ${ipAddress}. Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Error in handleIPLookup:', error);
        await interaction.editReply('An error occurred while fetching IP information.');
    }
}

function isMorseCode(input) {
    return /^[.-\s/]+$/.test(input);
}

async function handlePing(interaction) {
    await interaction.deferReply();
    try {
        const sent = await interaction.fetchReply();
        const roundtripLatency = sent.createdTimestamp - interaction.createdTimestamp;
        const wsLatency = interaction.client.ws.ping;

        const embed = new EmbedBuilder()
            .setTitle('Ping Information')
            .addFields(
                { name: 'Roundtrip Latency', value: `${roundtripLatency}ms`, inline: true },
                { name: 'WebSocket Latency', value: `${wsLatency}ms`, inline: true }
            )
            .setColor('Green')
            .setFooter({ text: footerText });

        await interaction.editReply({ content: null, embeds: [embed] });
    } catch (error) {
        console.error('Error in handlePing:', error);
        await interaction.editReply('An error occurred while fetching ping information.');
    }
}

async function handleConvert(interaction) {
    await interaction.deferReply();
    try {
        const value = interaction.options.getNumber('value');
        const fromUnit = interaction.options.getString('from').toLowerCase();
        const toUnit = interaction.options.getString('to').toLowerCase();

        const result = convertUnit(value, fromUnit, toUnit);

        if (result !== null) {
            const embed = new EmbedBuilder()
                .setTitle('Unit Conversion')
                .setDescription(`${value} ${fromUnit} = ${result} ${toUnit}`)
                .setColor('Green')
                .setFooter({ text: footerText });

            await interaction.editReply({ embeds: [embed] });
        } else {
            await interaction.editReply('Invalid unit conversion. Please check your units and try again.');
        }
    } catch (error) {
        console.error('Error in handleConvert:', error);
        await interaction.editReply('An error occurred while converting units.');
    }
}

function convertUnit(value, fromUnit, toUnit) {
    const conversions = {
        // Length
        'm': 1,
        'km': 1000,
        'cm': 0.01,
        'mm': 0.001,
        'in': 0.0254,
        'ft': 0.3048,
        'yd': 0.9144,
        'mi': 1609.34,

        // Weight
        'kg': 1,
        'g': 0.001,
        'mg': 0.000001,
        'lb': 0.453592,
        'oz': 0.0283495,

        // Temperature conversions are handled separately
    };

    // Special case for temperature
    if ((fromUnit === 'c' && toUnit === 'f') || (fromUnit === 'f' && toUnit === 'c')) {
        if (fromUnit === 'c') {
            return (value * 9/5) + 32;
        } else {
            return (value - 32) * 5/9;
        }
    }

    if (conversions[fromUnit] && conversions[toUnit]) {
        return (value * conversions[fromUnit] / conversions[toUnit]).toFixed(4);
    }

    return null; // Invalid conversion
}

const anagramMap = new Map();
wordList.forEach(word => {
    const sortedWord = word.split('').sort().join('');
    if (!anagramMap.has(sortedWord)) {
        anagramMap.set(sortedWord, []);
    }
    anagramMap.get(sortedWord).push(word);
});

async function handleAnagram(interaction) {
    await interaction.deferReply();
    try {
        const input = interaction.options.getString('input').toLowerCase().replace(/[^a-z]/g, '');
        const sortedInput = input.split('').sort().join('');
        const anagrams = anagramMap.get(sortedInput) || [];

        // Remove the original word from the anagram list
        const filteredAnagrams = anagrams.filter(word => word !== input);

        const embed = new EmbedBuilder()
            .setTitle(`Anagrams for "${interaction.options.getString('input')}"`)
            .setColor('Green')
            .setFooter({ text: footerText });

        if (filteredAnagrams.length > 0) {
            embed.setDescription(filteredAnagrams.slice(0, 20).join(', ') + (filteredAnagrams.length > 20 ? '...' : ''));
            embed.addFields({ name: 'Total Anagrams Found', value: filteredAnagrams.length.toString() });
        } else {
            embed.setDescription('No anagrams found.');
        }

        await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        console.error('Error in handleAnagram:', error);
        await interaction.editReply('An error occurred while finding anagrams.');
    }
}

async function handleFact(interaction) {
    await interaction.deferReply();
    try {
        const response = await axios.get('https://uselessfacts.jsph.pl/random.json?language=en');
        const fact = response.data.text;

        const embed = new EmbedBuilder()
            .setTitle('😂 Random Fact')
            .setDescription(fact)
            .setColor('Random')
            .setFooter({ text: footerText });

        await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        console.error('Error in handleFact:', error);
        await interaction.editReply('An error occurred while fetching a random fact.');
    }
}

async function handleHelp(interaction) {
    await interaction.deferReply();
    try {
        const embed = new EmbedBuilder()
            .setTitle('Available Commands')
            .setColor('Green')
            .setDescription('Here are all the available commands, categorized for easy reference:')
            .setFooter({ text: footerText });

        const categories = [
            {
                name: '📊 Utility',
                commands: [
                    { name: 'ping', desc: 'Bot latency' },
                    { name: 'help', desc: 'Show commands' },
                    { name: 'botinfo', desc: 'Bot info' },
                    { name: 'time', desc: 'Get time' },
                    { name: 'ip', desc: 'IP info' },
                    { name: 'pass-gen', desc: 'Generate password' }
                ]
            },
            {
                name: '💬 Communication',
                commands: [
                    { name: 'qr', desc: 'Generate QR code' },
                    { name: 'gif', desc: 'Send GIF' }
                ]
            },
            {
                name: '📝 Language & Text',
                commands: [
                    { name: 'dic', desc: 'Word definition' },
                    { name: 'anagram', desc: 'Find anagrams' },
                    { name: 'convert', desc: 'Convert units' }
                ]
            },
            {
                name: '🔤 Morse Code',
                commands: [
                    { name: 'morse', desc: 'Text to Morse' },
                    { name: 'demorse', desc: 'Morse to text' },
                    { name: 'ligmorse', desc: 'Visual Morse' },
                    { name: 'smorse', desc: 'Audio Morse' },
                    { name: 'learn', desc: 'Learn Morse' }
                ]
            },
            {
                name: '🎲 Fun & Games',
                commands: [
                    { name: 'coin-flip', desc: 'Flip a coin' },
                    { name: 'roll', desc: 'Roll a die' }
                ]
            }
        ];

        categories.forEach(category => {
            let fieldValue = category.commands.map(cmd => 
                `\`/${cmd.name}\` - ${cmd.desc}`
            ).join('\n');
            embed.addFields({ name: category.name, value: fieldValue });
        });

        await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        console.error('Error in handleHelp:', error);
        await interaction.editReply('An error occurred while fetching the help information.');
    }
}

async function handleDictionary(interaction) {
    await interaction.deferReply();
    try {
        const word = interaction.options.getString('word');
        const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = response.data[0];

        if (data) {
            const embed = new EmbedBuilder()
                .setTitle(`Definition of "${word}"`)
                .setColor('Green')
                .setFooter({ text: footerText });

            data.meanings.forEach((meaning, index) => {
                if (index < 3) {
                    let definitionText = '';
                    meaning.definitions.slice(0, 2).forEach((def, defIndex) => {
                        definitionText += `${defIndex + 1}. ${def.definition}\n`;
                        if (def.example) {
                            definitionText += `   Example: *${def.example}*\n`;
                        }
                    });
                    embed.addFields({ name: `${meaning.partOfSpeech}`, value: definitionText });
                }
            });

            if (data.phonetic) {
                embed.setDescription(`Phonetic: ${data.phonetic}`);
            }

            await interaction.editReply({ embeds: [embed] });
        } else {
            await interaction.editReply(`Sorry, I couldn't find a definition for "${word}".`);
        }
    } catch (error) {
        console.error('Error in handleDictionary:', error);
        await interaction.editReply('An error occurred while looking up the word. Please try again.');
    }
}

async function handleBotInfo(interaction) {
    await interaction.deferReply();
    try {
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Morse Bot Information')
            .setThumbnail('https://i.ibb.co/kQd588T/image.png')
            .addFields(
                { name: 'Bot Name', value: 'Morse', inline: true },
                { name: 'Language', value: 'Javascript', inline: true },
                { name: 'Hosted On', value: 'Raspberry Pi 3 [Banglore/IN]', inline: true },
                { name: 'Creator', value: '[GitHub](https://github.com/jagath-sajjan) | [YouTube](https://youtube.com/@nobooklad)', inline: false }
            )
            .setFooter({ text: footerText });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Invite')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://discord.com/oauth2/authorize?client_id=1270040432427925677&permissions=1758118824378192&integration_type=0&scope=applications.commands+bot'),
                new ButtonBuilder()
                    .setLabel('Support')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://discord.gg/c4WEUgRDT4'),
                new ButtonBuilder()
                    .setLabel('Buy Me Coffee')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://buymeacoffee.com/jagathsajjan')
            );

        await interaction.editReply({ embeds: [embed], components: [row] });
    } catch (error) {
        console.error('Error in handleBotInfo:', error);
        await interaction.editReply('An error occurred while fetching bot information.');
    }
}


async function handleQR(interaction) {
    await interaction.deferReply();
    try {
        const type = interaction.options.getString('type');
        const content = interaction.options.getString('content');
        const qrAttachment = await generateQRCode(type, content);
        if (qrAttachment) {
            const embed = new EmbedBuilder()
                .setTitle(`Generated QR Code (${type.toUpperCase()})`)
                .setDescription(`Content: ${content}`)
                .setImage('attachment://qrcode.png')
                .setColor('Green')
                .setFooter({ text: footerText });

            await interaction.editReply({ embeds: [embed], files: [qrAttachment] });
        } else {
            await interaction.editReply('Sorry, there was an error generating the QR code. Please try again.');
        }
    } catch (error) {
        console.error('Error in handleQR:', error);
        await interaction.editReply('An error occurred while generating the QR code.');
    }
}

async function generateQRCode(type, content) {
    let qrContent;
    switch (type.toLowerCase()) {
        case 'upi':
            qrContent = `upi://pay?pa=${encodeURIComponent(content)}`;
            break;
        case 'paypal':
            qrContent = `https://www.paypal.com/paypalme/${encodeURIComponent(content)}`;
            break;
        default:
            qrContent = content;
    }

    try {
        const buffer = await QRCode.toBuffer(qrContent);
        return new AttachmentBuilder(buffer, { name: 'qrcode.png' });
    } catch (error) {
        console.error('Error generating QR code:', error);
        return null;
    }
}

async function handleCoinFlip(interaction) {
    await interaction.deferReply();
    try {
        const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
        await interaction.editReply(`The coin landed on: **${result}**`);
    } catch (error) {
        console.error('Error in handleCoinFlip:', error);
        await interaction.editReply('An error occurred while flipping the coin.');
    }
}

async function handleAscii(interaction) {
    await interaction.deferReply();
    try {
        const text = interaction.options.getString('text');
        if (!text) {
            await interaction.editReply("Please provide text to convert to ASCII art.");
            return;
        }
        if (text.length > 2000) {
            await interaction.editReply("Please provide text shorter than 2000 characters!");
            return;
        }

        figlet.text(text, (err, data) => {
            if (err) {
                console.error('Error in figlet:', err);
                interaction.editReply(`An error occurred while generating ASCII art: ${err.message}`);
                return;
            }

            if (!data) {
                console.error('Figlet produced no data');
                interaction.editReply("An error occurred: No ASCII art was generated.");
                return;
            }

            const embed = new EmbedBuilder()
                .setTitle('💬 ASCII Art')
                .setDescription(`\`\`\`${data}\`\`\``)
                .setColor('Random')
                .setFooter({ text: footerText });

            interaction.editReply({ embeds: [embed] }).catch(error => {
                console.error('Error sending embed:', error);
                interaction.editReply("An error occurred while sending the ASCII art. It might be too large for Discord.");
            });
        });
    } catch (error) {
        console.error('Error in handleAscii:', error);
        await interaction.editReply(`An error occurred while processing the ASCII command: ${error.message}`);
    }
}

async function handleRoll(interaction) {
    await interaction.deferReply();
    try {
        const sides = interaction.options.getInteger('sides');
        if (sides < 2) {
            await interaction.editReply('A die must have at least 2 sides.');
            return;
        }
        const result = Math.floor(Math.random() * sides) + 1;
        await interaction.editReply(`You rolled a **${result}** on a ${sides}-sided die.`);
    } catch (error) {
        console.error('Error in handleRoll:', error);
        await interaction.editReply('An error occurred while rolling the die.');
    }
}

async function handleMorse(interaction) {
    await interaction.deferReply();
    try {
        const text = interaction.options.getString('text');
        const morseCode = textToMorse(text);

        const embed = new EmbedBuilder()
            .setTitle('Text to Morse Code Conversion')
            .addFields(
                { name: 'Original Text', value: text },
                { name: 'Morse Code', value: morseCode }
            )
            .setColor('Green')
            .setFooter({ text: footerText });

        await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        console.error('Error in handleMorse:', error);
        await interaction.editReply('An error occurred while converting to Morse code.');
    }
}

async function handleDemorse(interaction) {
    await interaction.deferReply();
    try {
        const morse = interaction.options.getString('morse');
        const decodedText = morseToText(morse);

        const embed = new EmbedBuilder()
            .setTitle('Morse Code to Text Conversion')
            .addFields(
                { name: 'Morse Code', value: morse },
                { name: 'Decoded Text', value: decodedText || 'Unable to decode' }
            )
            .setColor('Purple')
            .setFooter({ text: footerText });

        await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        console.error('Error in handleDemorse:', error);
        await interaction.editReply('An error occurred while converting from Morse code.');
    }
}

async function handleLightMorse(interaction) {
    await interaction.deferReply();
    try {
        const input = interaction.options.getString('input');
        if (!input) {
            await interaction.editReply('Please provide input text or Morse code.');
            return;
        }
        const morseCode = isMorseCode(input) ? input : textToMorse(input);
        const gifBuffer = await createMorseGif(morseCode);
        if (!gifBuffer) {
            await interaction.editReply('Error generating GIF. Please try again.');
            return;
        }
        const attachment = new AttachmentBuilder(gifBuffer, { name: 'morse.gif' });

        await interaction.editReply({ content: `**Here is a visual display of Morse code for:** ${input}`, files: [attachment] });
    } catch (error) {
        console.error('Error in handleLightMorse:', error);
        await interaction.editReply('An error occurred while generating the Morse code visual.');
    }
}

async function handleSoundMorse(interaction) {
    await interaction.deferReply();
    try {
        const input = interaction.options.getString('input');
        if (!input) {
            await interaction.editReply('Please provide input text or Morse code.');
            return;
        }
        const morseCode = isMorseCode(input) ? input : textToMorse(input);
        const audioBuffer = await createMorseAudio(morseCode);
        if (!audioBuffer) {
            await interaction.editReply('Error generating audio file. Please try again.');
            return;
        }
        const attachment = new AttachmentBuilder(audioBuffer, { name: 'morse.wav' });

        await interaction.editReply({ content: `**Here is the audio for the Morse code of:** ${input}`, files: [attachment] });
    } catch (error) {
        console.error('Error in handleSoundMorse:', error);
        await interaction.editReply('An error occurred while generating the Morse code audio.');
    }
}

async function handleLearn(interaction) {
    await interaction.deferReply();
    try {
        const morseCodeMap = {
            'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
            'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
            'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
            'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
            'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
            '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
            '8': '---..', '9': '----.', '.': '.-.-.-', ',': '--..--', '?': '..--..',
            "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
            '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.',
            '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.'
        };

        const embed = new EmbedBuilder()
            .setTitle('Morse Code Reference')
            .setDescription('Here\'s a comprehensive list of Morse code for alphabets, numbers, and common symbols:')
            .setColor('Green')
            .setFooter({ text: footerText });

        let alphabets = '';
        let numbers = '';
        let symbols = '';

        for (const [char, code] of Object.entries(morseCodeMap)) {
            const entry = `**${char}** ➤ *In Morse Is*  〔 **${code}** 〕\n`;
            if (/[A-Z]/.test(char)) {
                alphabets += entry;
            } else if (/[0-9]/.test(char)) {
                numbers += entry;
            } else {
                symbols += entry;
            }
        }

        embed.addFields(
            { name: 'Alphabets', value: alphabets.trim() || 'None', inline: false },
            { name: 'Numbers', value: numbers.trim() || 'None', inline: false },
            { name: 'Symbols', value: symbols.trim() || 'None', inline: false }
        );

        await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        console.error('Error in handleLearn:', error);
        await interaction.editReply('An error occurred while fetching the Morse code reference.');
    }
}

function textToMorse(text) {
    const morseCode = {
        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
        'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
        'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
        'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
        'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
        '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
        '8': '---..', '9': '----.'
    };

    return text.toUpperCase().split('').map(char => morseCode[char] || char).join(' ');
}

function morseToText(morse) {
    const morseCode = {
        '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F',
        '--.': 'G', '....': 'H', '..': 'I', '.---': 'J', '-.-': 'K', '.-..': 'L',
        '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R',
        '...': 'S', '-': 'T', '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X',
        '-.--': 'Y', '--..': 'Z', '-----': '0', '.----': '1', '..---': '2',
        '...--': '3', '....-': '4', '.....': '5', '-....': '6', '--...': '7',
        '---..': '8', '----.': '9'
    };

    return morse.split(' ').map(code => morseCode[code] || ' ').join('');
}

async function createMorseGif(morseCode) {
    const width = 100;
    const height = 100;
    const encoder = new GIFEncoder(width, height);
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    return new Promise((resolve, reject) => {
        const stream = encoder.createReadStream();
        const buffers = [];

        stream.on('data', buffer => buffers.push(buffer));
        stream.on('end', () => resolve(Buffer.concat(buffers)));
        stream.on('error', reject);

        encoder.start();
        encoder.setRepeat(0); // 0 for repeat, -1 for no-repeat
        encoder.setDelay(200); // frame delay in ms
        encoder.setQuality(10); // image quality, lower is better

        const frames = morseCode.split('').flatMap(char => {
            if (char === '.' || char === '-') {
                return [
                    () => {
                        ctx.fillStyle = 'white';
                        ctx.fillRect(0, 0, width, height);
                    },
                    () => {
                        ctx.fillStyle = 'black';
                        ctx.fillRect(0, 0, width, height);
                    }
                ];
            }
            return [() => {
                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, width, height);
            }];
        });

        frames.forEach(frame => {
            frame();
            encoder.addFrame(ctx);
        });

        encoder.finish();
    });
}

async function createMorseAudio(morseCode) {
    const dotLength = 50; // Shorter dot length
    const dashLength = dotLength * 3;
    const pauseLength = dotLength;
    const letterPauseLength = dotLength * 3;
    const wordPauseLength = dotLength * 7;

    const sampleRate = 44100;
    const amplitude = 0.5;
    const frequency = 800;

    const audioData = [];

    function generateTone(duration) {
        const samples = Math.floor(duration * sampleRate / 1000);
        for (let i = 0; i < samples; i++) {
            const sample = amplitude * Math.sin(2 * Math.PI * frequency * i / sampleRate);
            audioData.push(Math.floor(sample * 32767));
        }
    }

    function generateSilence(duration) {
        const samples = Math.floor(duration * sampleRate / 1000);
        audioData.push(...new Array(samples).fill(0));
    }

    for (const char of morseCode) {
        if (char === '.') generateTone(dotLength);
        else if (char === '-') generateTone(dashLength);
        else if (char === ' ') generateSilence(letterPauseLength);
        else if (char === '/') generateSilence(wordPauseLength);
        generateSilence(pauseLength);
    }

    const buffer = Buffer.from(new Int16Array(audioData).buffer);

    const wavHeader = Buffer.alloc(44);
    wavHeader.write('RIFF', 0);
    wavHeader.writeUInt32LE(36 + buffer.length, 4);
    wavHeader.write('WAVE', 8);
    wavHeader.write('fmt ', 12);
    wavHeader.writeUInt32LE(16, 16);
    wavHeader.writeUInt16LE(1, 20);
    wavHeader.writeUInt16LE(1, 22);
    wavHeader.writeUInt32LE(sampleRate, 24);
    wavHeader.writeUInt32LE(sampleRate * 2, 28);
    wavHeader.writeUInt16LE(2, 32);
    wavHeader.writeUInt16LE(16, 34);
    wavHeader.write('data', 36);
    wavHeader.writeUInt32LE(buffer.length, 40);

    return Buffer.concat([wavHeader, buffer]);
}

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Morse app listening on port ${port}`);
});

client.login(process.env.DISCORD_BOT_TOKEN);

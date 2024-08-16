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

const GIFEncoder = require('gifencoder');
const { createCanvas } = require('canvas');
const { Routes } = require('discord-api-types/v9');
const QRCode = require('qrcode');
const express = require('express');
const https = require('https');
const path = require('path');
const fetch = require('node-fetch');

const footerText = 'Made By Jagath🩵';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const API_KEY = '54335ee630574a16988dd1a1232602e7';
const API_URL = 'https://aimlapi.com/api/chat';

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
                    name: 'ask',
                    description: 'Ask the AI a question',
                    options: [
                        {
                            name: 'text',
                            type: ApplicationCommandOptionType.String,
                            description: 'The question or prompt for the AI',
                            required: true
                        }
                    ]
                }
            ] },
        );
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
            case 'morse':
                await handleMorse(interaction);
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
            case 'ask':
                await handleAsk(interaction);
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

client.on('messageCreate', async (message) => {
    if (message.mentions.has(client.user) && !message.author.bot) {
        const prompt = message.content.replace(`<@!${client.user.id}>`, '').trim();
        const response = await getAIResponse(prompt);
        await message.reply(response);
    }
});

async function getAIResponse(prompt) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                prompt: prompt,
                max_tokens: 300,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].text.trim();
    } catch (error) {
        console.error('Error getting AI response:', error);
        return 'Sorry, I encountered an error while processing your request.';
    }
}

async function handleAsk(interaction) {
    await interaction.deferReply();
    const prompt = interaction.options.getString('text');
    const response = await getAIResponse(prompt);
    await interaction.editReply(response);
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

async function handleHelp(interaction) {
    await interaction.deferReply();
    try {
        const embed = new EmbedBuilder()
            .setTitle('Available Commands')
            .addFields(
                { name: '/ping', value: 'Show bot latency', inline: true },
                { name: '/botinfo', value: 'Show Bot Info', inline: false },
                { name: '/help', value: 'Show all available commands', inline: true },
                { name: '/qr [type] [content]', value: 'Generate a QR code (UPI, PayPal, or other)', inline: false },
                { name: '/morse [text]', value: 'Convert text to Morse code', inline: false },
                { name: '/demorse [morse]', value: 'Convert Morse code to text', inline: false },
                { name: '/ligmorse', value: 'Show Morse code with a visual display', inline: false },
                { name: '/smorse', value: 'Play Morse code audio', inline: false },
                { name: '/coin-flip', value: 'Flip a coin', inline: false },
                { name: '/roll [sides]', value: 'Roll a die', inline: false },
                { name: '/learn', value: 'Learn Morse code', inline: false }
            )
            .setColor('Green')
            .setFooter({ text: footerText });
        await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        console.error('Error in handleHelp:', error);
        await interaction.editReply('An error occurred while fetching the help information.');
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
                .setColor('Blue')
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
            .setColor('Blue')
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

        await interaction.editReply({ content: `Here is a visual display of Morse code for: ${input}`, files: [attachment] });
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

        await interaction.editReply({ content: `Here is the audio for the Morse code of: ${input}`, files: [attachment] });
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

client.login(process.env.DISCORD_BOT_TOKEN);if (typeof globalThis.ReadableStream === 'undefined') {
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

const GIFEncoder = require('gifencoder');
const { createCanvas } = require('canvas');
const { Routes } = require('discord-api-types/v9');
const QRCode = require('qrcode');
const express = require('express');
const https = require('https');
const path = require('path');
const fetch = require('node-fetch');

const footerText = 'Made By Jagath🩵';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const API_KEY = '54335ee630574a16988dd1a1232602e7';
const API_URL = 'https://aimlapi.com/api/chat';

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
                    name: 'ask',
                    description: 'Ask the AI a question',
                    options: [
                        {
                            name: 'text',
                            type: ApplicationCommandOptionType.String,
                            description: 'The question or prompt for the AI',
                            required: true
                        }
                    ]
                }
            ] },
        );
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
            case 'morse':
                await handleMorse(interaction);
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
            case 'ask':
                await handleAsk(interaction);
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

client.on('messageCreate', async (message) => {
    if (message.mentions.has(client.user) && !message.author.bot) {
        const prompt = message.content.replace(`<@!${client.user.id}>`, '').trim();
        const response = await getAIResponse(prompt);
        await message.reply(response);
    }
});

async function getAIResponse(prompt) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                prompt: prompt,
                max_tokens: 300,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].text.trim();
    } catch (error) {
        console.error('Error getting AI response:', error);
        return 'Sorry, I encountered an error while processing your request.';
    }
}

async function handleAsk(interaction) {
    await interaction.deferReply();
    const prompt = interaction.options.getString('text');
    const response = await getAIResponse(prompt);
    await interaction.editReply(response);
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

async function handleHelp(interaction) {
    await interaction.deferReply();
    try {
        const embed = new EmbedBuilder()
            .setTitle('Available Commands')
            .addFields(
                { name: '/ping', value: 'Show bot latency', inline: true },
                { name: '/botinfo', value: 'Show Bot Info', inline: false },
                { name: '/help', value: 'Show all available commands', inline: true },
                { name: '/qr [type] [content]', value: 'Generate a QR code (UPI, PayPal, or other)', inline: false },
                { name: '/morse [text]', value: 'Convert text to Morse code', inline: false },
                { name: '/demorse [morse]', value: 'Convert Morse code to text', inline: false },
                { name: '/ligmorse', value: 'Show Morse code with a visual display', inline: false },
                { name: '/smorse', value: 'Play Morse code audio', inline: false },
                { name: '/coin-flip', value: 'Flip a coin', inline: false },
                { name: '/roll [sides]', value: 'Roll a die', inline: false },
                { name: '/learn', value: 'Learn Morse code', inline: false }
            )
            .setColor('Green')
            .setFooter({ text: footerText });
        await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        console.error('Error in handleHelp:', error);
        await interaction.editReply('An error occurred while fetching the help information.');
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
                .setColor('Blue')
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
            .setColor('Blue')
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

        await interaction.editReply({ content: `Here is a visual display of Morse code for: ${input}`, files: [attachment] });
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

        await interaction.editReply({ content: `Here is the audio for the Morse code of: ${input}`, files: [attachment] });
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

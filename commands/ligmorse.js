const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const GIFEncoder = require('gifencoder');
const { createCanvas } = require('canvas');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ligmorse')
        .setDescription('Show Morse code with a visual display')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('Text or Morse code to display')
                .setRequired(true)),

    async execute(interaction) {
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
            console.error('Error in ligmorse command:', error);
            await interaction.editReply('An error occurred while generating the Morse code visual.');
        }
    },
};

function isMorseCode(input) {
    return /^[.-\s/]+$/.test(input);
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
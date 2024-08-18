const { SlashCommandBuilder } = require('@discordjs/builders');
const { AttachmentBuilder } = require('discord.js');

module.exports = {
    name: 'smorse',
    data: new SlashCommandBuilder()
        .setName('smorse')
        .setDescription('Play Morse code audio')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('Text or Morse code to play')
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
            const audioBuffer = await createMorseAudio(morseCode);
            if (!audioBuffer) {
                await interaction.editReply('Error generating audio file. Please try again.');
                return;
            }
            const attachment = new AttachmentBuilder(audioBuffer, { name: 'morse.wav' });

            await interaction.editReply({ content: `**Here is the audio for the Morse code of:** ${input}`, files: [attachment] });
        } catch (error) {
            console.error('Error in smorse command:', error);
            await interaction.editReply('An error occurred while generating the Morse code audio.');
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

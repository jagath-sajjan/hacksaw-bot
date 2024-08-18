const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'morse', // Add this line
    description: 'Convert text to Morse code',
    data: new SlashCommandBuilder()
        .setName('morse')
        .setDescription('Convert text to Morse code')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('The text to convert to Morse code')
                .setRequired(true)),

    async execute(interaction) {
        const text = interaction.options.getString('text');
        const morseCode = textToMorse(text);

        const embed = new EmbedBuilder()
            .setTitle('Text to Morse Code Conversion')
            .addFields(
                { name: 'Original Text', value: text },
                { name: 'Morse Code', value: morseCode }
            )
            .setColor('Green')
            .setFooter({ text: 'Made By Jagath🩵' });

        await interaction.reply({ embeds: [embed] });
    },
};

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

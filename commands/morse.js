const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'morse',
    description: 'Convert text to Morse code',
    options: [
        {
            name: 'text',
            type: 3,
            description: 'The text to convert to Morse code',
            required: true
        }
    ],
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
            .setFooter({ text: 'HackSaw Morse API.', iconURL: interaction.client.user.displayAvatarURL() });

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

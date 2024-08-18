const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'learn',
    data: new SlashCommandBuilder()
        .setName('learn')
        .setDescription('Learn Morse code'),
    async execute(interaction) {
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
                .setFooter({ text: 'Made By Jagath🩵' });

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

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error in learn command:', error);
            await interaction.reply('An error occurred while fetching the Morse code reference.');
        }
    },
};
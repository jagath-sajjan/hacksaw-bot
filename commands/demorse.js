const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'demorse',
    description: 'Convert Morse code to text',
    options: [
        {
            name: 'morse',
            type: 3, // STRING
            description: 'The Morse code to convert to text',
            required: true
        }
    ],
    async execute(interaction) {
        const morse = interaction.options.getString('morse');
        const decodedText = morseToText(morse);

        const embed = new EmbedBuilder()
            .setTitle('Morse Code to Text Conversion')
            .addFields(
                { name: 'Morse Code', value: morse },
                { name: 'Decoded Text', value: decodedText || 'Unable to decode' }
            )
            .setColor('Purple')
            .setFooter({ text: 'HackSaw Demorse API.', iconURL: interaction.client.user.displayAvatarURL() });

        await interaction.reply({ embeds: [embed] });
    },
};

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

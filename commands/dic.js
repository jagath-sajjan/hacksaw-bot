const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'dic',
    description: 'Look up definitions for words',
    options: [
        {
            name: 'word',
            type: 3, // STRING
            description: 'The word to look up',
            required: true
        }
    ],
    async execute(interaction) {
        await interaction.deferReply();
        try {
            const word = interaction.options.getString('word');
            const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const data = response.data[0];

            if (data) {
                const embed = new EmbedBuilder()
                    .setTitle(`Definition of "${word}"`)
                    .setColor('Green')
                    .setFooter({ text: 'HackSaw Dictionary API.', iconURL: interaction.client.user.displayAvatarURL() });

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
            console.error('Error in dictionary command:', error);
            await interaction.editReply('An error occurred while looking up the word. Please try again.');
        }
    },
};

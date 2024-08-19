const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'fact',
    description: 'Get a random fact',
    async execute(interaction) {
        await interaction.deferReply();
        try {
            const response = await axios.get('https://uselessfacts.jsph.pl/random.json?language=en');
            const fact = response.data.text;

            const embed = new EmbedBuilder()
                .setTitle('🥶 Random Fact')
                .setDescription(fact)
                .setColor('Random')
                .setFooter({ text: 'HackSaw Fact API.', iconURL: interaction.client.user.displayAvatarURL() });

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Error in fact command:', error);
            await interaction.editReply('An error occurred while fetching a random fact.');
        }
    },
};

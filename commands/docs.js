const Discord = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'docs',
    description: 'Search the Discord.js documentation',
    options: [
        {
            name: 'query',
            type: 3,
            description: 'The term to search for in the documentation',
            required: true
        }
    ],
    async execute(interaction) {
        await interaction.deferReply();

        const query = interaction.options.getString('query');

        const uri = `https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(query)}`;

        try {
            const response = await axios.get(uri);
            const { data } = response;

            if (data && !data.error) {
                await interaction.editReply({ embeds: [data] });
            } else {
                await interaction.editReply({ content: "Could not find that documentation!", ephemeral: true });
            }
        } catch (error) {
            console.error('Error fetching documentation:', error);
            await interaction.editReply({ content: "An error occurred while fetching the documentation.", ephemeral: true });
        }
    },
};

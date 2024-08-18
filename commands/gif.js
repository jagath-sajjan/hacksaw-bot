const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'gif',
    description: 'Search for a GIF',
    options: [
        {
            name: 'keyword',
            type: 3, // STRING
            description: 'The keyword to search for',
            required: true
        }
    ],
    async execute(interaction) {
        await interaction.deferReply();
        try {
            const keyword = interaction.options.getString('keyword');
            console.log(`Searching for GIF with keyword: ${keyword}`);

            const apiKey = 'zSZRgLmqchF9XkNlDIaoXEt4xY6xK7ho'; // Your Giphy API key
            const response = await axios.get(`https://api.giphy.com/v1/gifs/search`, {
                params: {
                    api_key: apiKey,
                    q: keyword,
                    limit: 1
                }
            });

            console.log('Giphy API response status:', response.status);
            console.log('Giphy API response data:', JSON.stringify(response.data, null, 2));

            if (response.data && response.data.data && response.data.data.length > 0) {
                const gifUrl = response.data.data[0].images.original.url;
                console.log(`Found GIF URL: ${gifUrl}`);

                const embed = new EmbedBuilder()
                    .setTitle(`GIF Search: ${keyword}`)
                    .setImage(gifUrl)
                    .setColor('Random')
                    .setFooter({ text: 'Made By Jagath🩵' });

                await interaction.editReply({ embeds: [embed] });
            } else {
                console.log(`No GIFs found for keyword: ${keyword}`);
                await interaction.editReply(`No GIFs found for "${keyword}". Please try a different search term.`);
            }
        } catch (error) {
            console.error('Error in handleGif:', error.message);
            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Error status:', error.response.status);
            } else if (error.request) {
                console.error('Error request:', error.request);
            }
            console.error('Error stack:', error.stack);

            let errorMessage = 'An error occurred while searching for the GIF. ';
            if (error.response && error.response.status === 403) {
                errorMessage += 'API key may be invalid. Please contact the bot administrator.';
            } else if (error.code === 'ECONNABORTED') {
                errorMessage += 'The request timed out. Please try again later.';
            } else {
                errorMessage += 'Please try again later.';
            }

            await interaction.editReply(errorMessage);
        }
    }
};
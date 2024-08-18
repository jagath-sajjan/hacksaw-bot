const Discord = require('discord.js');

module.exports = {
    name: 'youtube',
    description: 'Search for a video on YouTube',
    options: [
        {
            name: 'query',
            description: 'The search query for YouTube',
            type: 3,
            required: true
        }
    ],
    async execute(interaction) {
        const query = encodeURIComponent(interaction.options.getString('query'));
        const link = `https://www.youtube.com/results?search_query=${query}`;

        const embed = new Discord.EmbedBuilder()
            .setColor('#FF0000')
            .setTitle(`YouTube Search Results for: ${interaction.options.getString('query')}`)
            .setDescription(`[Click here to see the search results](${link})`)
            .setThumbnail('https://www.youtube.com/s/desktop/7449ebf7/img/favicon_144x144.png')
            .setFooter({ text: 'Powered by YouTube' });

        await interaction.reply({ embeds: [embed] });
    }
};

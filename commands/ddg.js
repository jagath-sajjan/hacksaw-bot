const Discord = require('discord.js');

module.exports = {
    name: 'ddg',
    description: 'Search DuckDuckGo for a given query',
    options: [
        {
            name: 'query',
            type: 3,
            description: 'The search query',
            required: true
        }
    ],
    async execute(interaction) {
        let query = encodeURIComponent(interaction.options.getString('query'));
        let link = `https://duckduckgo.com/?q=${query}`;

        await interaction.reply({
            embeds: [{
                color: 0x0099ff,
                title: `Search Results for: ${interaction.options.getString('query')}`,
                description: `I have found the following for your query:`,
                fields: [
                    {
                        name: '🔗 Link',
                        value: `[Click here to see the results](${link})`,
                        inline: true,
                    }
                ],
                footer: {
                    text: 'Powered by DuckDuckGo'
                },
            }]
        });
    },
};

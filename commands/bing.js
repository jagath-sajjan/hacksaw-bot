const Discord = require('discord.js');

module.exports = {
    name: 'bing',
    description: 'Search Bing for a given query',
    options: [
        {
            name: 'query',
            type: 3, // STRING type
            description: 'The search query',
            required: true
        }
    ],
    async execute(interaction) {
        let query = encodeURIComponent(interaction.options.getString('query'));
        let link = `https://www.bing.com/search?q=${query}`;

        await interaction.reply({
            content: `I have found the following for: \`${query}\``,
            embeds: [
                {
                    fields: [
                        {
                            name: `🔗┇Link`,
                            value: `[Click here to see the results](${link})`,
                            inline: true,
                        }
                    ]
                }
            ]
        });
    }
};

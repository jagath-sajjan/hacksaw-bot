const Discord = require('discord.js');

module.exports = {
    name: 'google',
    description: 'Search Google for a given query',
    options: [
        {
            name: 'query',
            type: 3, // STRING type
            description: 'The search query',
            required: true
        }
    ],
    async execute(interaction) {
        const query = encodeURIComponent(interaction.options.getString('query'));
        const link = `https://www.google.com/search?q=${query}`;

        const embed = new Discord.EmbedBuilder()
            .setColor('#4285F4')
            .setTitle(`Google Search: ${interaction.options.getString('query')}`)
            .setDescription(`I have found the following for: \`${interaction.options.getString('query')}\``)
            .addFields(
                { name: '🔗 Link', value: `[Click here to see the results](${link})`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'Powered by Google' });

        await interaction.reply({ embeds: [embed] });
    },
};

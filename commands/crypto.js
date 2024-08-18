const Discord = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'crypto',
    description: 'Get the current price of a cryptocurrency',
    options: [
        {
            name: 'coin',
            description: 'The cryptocurrency to check (e.g., bitcoin, ethereum)',
            type: 3,
            required: true
        },
        {
            name: 'currency',
            description: 'The currency to display the price in (e.g., usd, eur)',
            type: 3,
            required: true
        }
    ],
    async execute(interaction) {
        const coin = interaction.options.getString('coin');
        const currency = interaction.options.getString('currency');

        try {
            const { data } = await axios.get(
                `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=${currency}`
            );

            if (!data[coin] || !data[coin][currency]) {
                return interaction.reply({ content: 'Invalid coin or currency. Please check your inputs!', ephemeral: true });
            }

            const embed = new Discord.EmbedBuilder()
                .setTitle('💹 Crypto Stats')
                .setDescription(`The current price of **1 ${coin}** = **${data[coin][currency]} ${currency}**`)
                .setColor('#0099ff')
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching crypto data:', error);
            await interaction.reply({ content: 'An error occurred while fetching the cryptocurrency data. Please try again later.', ephemeral: true });
        }
    },
};

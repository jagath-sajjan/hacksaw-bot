const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'crypto',
    description: 'Get the current price of a cryptocurrency',
    options: [
        {
            name: 'coin',
            type: 3, // STRING
            description: 'The cryptocurrency to check (e.g., bitcoin, btc)',
            required: true
        },
        {
            name: 'currency',
            type: 3, // STRING
            description: 'The fiat currency (e.g., USD, INR)',
            required: true
        }
    ],
    async execute(interaction) {
        const coin = interaction.options.getString('coin').toLowerCase();
        const currency = interaction.options.getString('currency').toLowerCase();

        try {
            const { data } = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=${currency}`);

            if (!data[coin] || !data[coin][currency]) {
                await interaction.reply({ content: `Could not find data for ${coin}. Please check the coin name and try again.`, ephemeral: true });
                return;
            }

            const priceInCurrency = data[coin][currency];
            const embed = new EmbedBuilder()
                .setTitle('💹 Crypto Price Information')
                .addFields(
                    { name: 'Cryptocurrency', value: coin.toUpperCase(), inline: true },
                    { name: 'Price', value: `${priceInCurrency} ${currency.toUpperCase()}`, inline: true }
                )
                .setColor('#0099ff')
                .setFooter({ text: 'Crypto Price Data', iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching crypto data:', error);
            await interaction.reply({ content: 'An error occurred while fetching the cryptocurrency data. Please try again later.', ephemeral: true });
        }
    },
};

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
            // Fetch cryptocurrency data from CoinCap API
            const { data } = await axios.get(`https://api.coincap.io/v2/assets/${coin}`);

            if (!data || !data.data) {
                await interaction.reply({ content: `Could not find data for ${coin}. Please check the coin name and try again.`, ephemeral: true });
                return;
            }

            const cryptoData = data.data;
            const priceInUsd = parseFloat(cryptoData.priceUsd); // Price in USD

            // Convert USD to the desired currency using another API call to get the conversion rate
            const currencyConversionResponse = await axios.get(`https://api.coincap.io/v2/rates/${currency}`);
            if (!currencyConversionResponse.data || !currencyConversionResponse.data.data) {
                await interaction.reply({ content: `Could not find data for ${currency}. Please check the currency name and try again.`, ephemeral: true });
                return;
            }

            const conversionRate = parseFloat(currencyConversionResponse.data.data.rateUsd);
            const priceInCurrency = priceInUsd / conversionRate;

            // Create an embedded message with the cryptocurrency price information
            const embed = new EmbedBuilder()
                .setTitle('💹 Crypto Price Information')
                .addFields(
                    { name: 'Cryptocurrency', value: cryptoData.name, inline: true },
                    { name: 'Symbol', value: cryptoData.symbol.toUpperCase(), inline: true },
                    { name: 'Price', value: `${priceInCurrency.toFixed(2)} ${currency.toUpperCase()}`, inline: true }
                )
                .setColor('#0099ff')
                .setFooter({ text: 'HackSaw Crypto API', iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching crypto data:', error);
            await interaction.reply({ content: 'An error occurred while fetching the cryptocurrency data. Please try again later.', ephemeral: true });
        }
    },
};

const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('crypto')
    .setDescription('Get the current price of a cryptocurrency')
    .addStringOption(option => 
      option.setName('coin')
        .setDescription('The cryptocurrency to check (e.g., bitcoin, btc)')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('currency')
        .setDescription('The fiat currency (e.g., USD, INR)')
        .setRequired(true)),
  
  async execute(interaction) {
    const coin = interaction.options.getString('coin').toLowerCase();
    const currency = interaction.options.getString('currency').toLowerCase();

    try {
      // Fetch cryptocurrency data from CoinCap API
      const response = await axios.get(`https://api.coincap.io/v2/rates/${coin}`);
      const data = response.data.data;

      if (!data) {
        await interaction.reply({ content: `Could not find data for ${coin}. Please check the coin name and try again.`, ephemeral: true });
        return;
      }

      const priceInCurrency = (data.rateUsd * await getCurrencyConversionRate(currency)).toFixed(2);

      await interaction.reply(`The current price of ${coin.toUpperCase()} is ${priceInCurrency} ${currency.toUpperCase()}.`);
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      await interaction.reply({ content: 'An error occurred while fetching the cryptocurrency data. Please try again later.', ephemeral: true });
    }
  }
};

// Helper function to convert USD to the desired fiat currency using CoinCap
async function getCurrencyConversionRate(currency) {
  try {
    const response = await axios.get(`https://api.coincap.io/v2/rates/${currency}`);
    return response.data.data.rateUsd;
  } catch (error) {
    console.error('Error fetching currency conversion rate:', error);
    return 1; 
  }
}

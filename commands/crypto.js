const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'crypto',
    description: 'Get the current price and historical chart of a cryptocurrency',
    options: [
        {
            name: 'coin',
            type: 3, // STRING
            description: 'The cryptocurrency to check',
            required: true,
            choices: [] // We'll populate this with available coins later
        },
        {
            name: 'vs_currency',
            type: 3, // STRING
            description: 'The currency to display the price in',
            required: true,
            choices: [
                { name: 'Indian Rupee', value: 'inr' },
                { name: 'Euro', value: 'eur' },
                { name: 'British Pound', value: 'gbp' },
                { name: 'Japanese Yen', value: 'jpy' },
                { name: 'US Dollar', value: 'usd' } 
            ]
        },
        {
            name: 'days',
            type: 4, // INTEGER
            description: 'The number of days to fetch historical data for',
            required: true,
            choices: [
                { name: '7 days', value: 7 },
                { name: '30 days', value: 30 },
                { name: '90 days', value: 90 },
                { name: '1 year', value: 365 }
            ]
        }
    ],
    async execute(interaction) {
        try {
            // Fetch available coins from CoinGecko API
            const { data: coinsData } = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
                params: { vs_currency: 'usd', order: 'market_cap_desc', per_page: 200, page: 1 }
            });

            // Update the coin option choices with the available coins
            interaction.options.data.find(option => option.name === 'coin').choices = coinsData.map(coin => ({
                name: `${coin.name} (${coin.symbol.toUpperCase()})`,
                value: coin.id
            }));

            const coinId = interaction.options.getString('coin');
            const vsCurrency = interaction.options.getString('vs_currency');
            const days = interaction.options.getInteger('days');

            // Fetch cryptocurrency data from CoinGecko API
            const { data: coinData } = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}`, {
                params: { vs_currency: vsCurrency }
            });

            if (!coinData || !coinData.market_data || !coinData.market_data.current_price) {
                await interaction.reply({
                    content: `Could not find data for ${coinId}. Please check the coin name and try again.`,
                    ephemeral: true
                });
                return;
            }
            const priceInCurrency = coinData.market_data.current_price[vsCurrency];

            // Fetch historical data for chart
            const { data: historicalData } = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`, {
                params: {
                    vs_currency: vsCurrency,
                    days: days
                }
            });

            if (!historicalData || !historicalData.prices) {
                await interaction.reply({
                    content: `Could not fetch historical data for ${coinId}. Please try again later.`,
                    ephemeral: true
                });
                return;
            }

            // Extract labels and prices for the chart
            const labels = historicalData.prices.map(entry => new Date(entry[0]).toLocaleDateString());
            const prices = historicalData.prices.map(entry => entry[1]);

            // Generate QuickChart URL
            const chartConfig = {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: `Price in ${vsCurrency.toUpperCase()}`,
                        data: prices,
                        borderColor: '#ff6600',
                        backgroundColor: 'rgba(255, 102, 0, 0.2)',
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(tooltipItem) {
                                    return `${vsCurrency.toUpperCase()} ${tooltipItem.raw.toFixed(2)}`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: `Date (${days} days)`
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: `Price (${vsCurrency.toUpperCase()})`
                            }
                        }
                    }
                }
            };
            const chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}`;

            // Create an embedded message with the cryptocurrency price information
            const embed = new EmbedBuilder()
                .setTitle(`💹 ${coinData.name} (${coinData.symbol.toUpperCase()}) Price`)
                .addFields(
                    { name: 'Price', value: `${vsCurrency.toUpperCase()} ${priceInCurrency.toFixed(2)}`, inline: true },
                    { name: 'Market Cap', value: `${vsCurrency.toUpperCase()} ${coinData.market_data.market_cap[vsCurrency].toLocaleString()}`, inline: true },
                    { name: 'All-Time High', value: `${vsCurrency.toUpperCase()} ${coinData.market_data.ath[vsCurrency].toFixed(2)}`, inline: true },
                    { name: 'All-Time Low', value: `${vsCurrency.toUpperCase()} ${coinData.market_data.atl[vsCurrency].toFixed(2)}`, inline: true }
                )
                .setColor('#0099ff')
                .setImage(chartUrl) // Add chart image to the embed
                .setFooter({ text: 'CoinGecko API', iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching crypto data:', error);
            await interaction.reply({
                content: 'An error occurred while fetching the cryptocurrency data. Please try again later.',
                ephemeral: true
            });
        }
    },
};

const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'crypto',
    description: 'Get the current price of a cryptocurrency and its historical chart',
    options: [
        {
            name: 'coin',
            type: 3, // STRING
            description: 'The cryptocurrency to check (e.g., BTC, USDT)',
            required: true
        },
        {
            name: 'interval',
            type: 3, // STRING
            description: 'The time interval for historical data',
            required: true,
            choices: [
                { name: '1 minute', value: '1m' },
                { name: '5 minutes', value: '5m' },
                { name: '15 minutes', value: '15m' },
                { name: '30 minutes', value: '30m' },
                { name: '1 hour', value: '1h' },
                { name: '2 hours', value: '2h' },
                { name: '6 hours', value: '6h' },
                { name: '12 hours', value: '12h' },
                { name: '1 day', value: '1d' }
            ]
        }
    ],
    async execute(interaction) {
        try {
            const coin = interaction.options.getString('coin').toUpperCase();
            const interval = interaction.options.getString('interval');

            // Fetch cryptocurrency data from Binance API
            const { data: priceData } = await axios.get('https://api.binance.com/api/v3/ticker/price', {
                params: { symbol: coin }
            });

            if (!priceData || !priceData.price) {
                await interaction.reply({
                    content: `Could not find data for ${coin}. Please check the coin symbol and ensure it is typed correctly.`,
                    ephemeral: true
                });
                return;
            }
            const priceInUsd = parseFloat(priceData.price); // Price in USD

            // Fetch historical data for chart
            const { data: historicalData } = await axios.get('https://api.binance.com/api/v3/klines', {
                params: {
                    symbol: coin,
                    interval: interval,
                    limit: 1000 // Adjust limit as needed
                }
            });

            if (!historicalData || historicalData.length === 0) {
                await interaction.reply({
                    content: `Could not fetch historical data for ${coin}. Please check the coin symbol and ensure it is typed correctly.`,
                    ephemeral: true
                });
                return;
            }

            // Extract labels and prices for the chart
            const labels = historicalData.map(entry => new Date(entry[0]).toLocaleDateString());
            const prices = historicalData.map(entry => parseFloat(entry[4])); // Closing price

            // Generate QuickChart URL
            const chartConfig = {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Price in USD',
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
                                    return `$${tooltipItem.raw.toFixed(2)}`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: `Date (${interval})`
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Price (USD)'
                            }
                        }
                    }
                }
            };
            const chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}`;

            // Create an embedded message with the cryptocurrency price information
            const embed = new EmbedBuilder()
                .setTitle('💹 Crypto Price Information')
                .addFields(
                    { name: 'Cryptocurrency', value: coin, inline: true },
                    { name: 'Price', value: `$${priceInUsd.toFixed(2)}`, inline: true }
                )
                .setColor('#0099ff')
                .setImage(chartUrl) // Add chart image to the embed
                .setFooter({ text: 'HackSaw Crypto API', iconURL: interaction.client.user.displayAvatarURL() })
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

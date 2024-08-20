const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'crypto',
    description: 'Get the current price of a cryptocurrency and its historical chart',
    options: [
        {
            name: 'coin',
            type: 3, // STRING
            description: 'The cryptocurrency to check (e.g., bitcoin, btc)',
            required: true
        },
        {
            name: 'interval',
            type: 3, // STRING
            description: 'The time interval for historical data (e.g., 1h, 3h, 1d)',
            required: true,
            choices: [
                { name: '2 hours', value: '2h' },
                { name: '3 hours', value: '3h' },
                { name: '1 day', value: '1d' },
                { name: '1 week', value: '1w' }
            ]
        }
    ],
    async execute(interaction) {
        const coin = interaction.options.getString('coin').toLowerCase();
        const interval = interaction.options.getString('interval');
        
        try {
            // Fetch cryptocurrency data from CoinCap API
            const { data } = await axios.get(`https://api.coincap.io/v2/assets/${coin}`);
            if (!data || !data.data) {
                await interaction.reply({ content: `Could not find data for ${coin}. Please check the coin name and try again.`, ephemeral: true });
                return;
            }
            const cryptoData = data.data;
            const priceInUsd = parseFloat(cryptoData.priceUsd); // Price in USD
            
            // Fetch historical data for chart
            const historicalDataResponse = await axios.get(`https://api.coincap.io/v2/assets/${coin}/history?interval=${interval}`);
            if (!historicalDataResponse.data || !historicalDataResponse.data.data) {
                await interaction.reply({ content: `Could not fetch historical data for ${coin}.`, ephemeral: true });
                return;
            }
            const historicalData = historicalDataResponse.data.data;
            const labels = historicalData.map(entry => new Date(entry.time).toLocaleDateString());
            const prices = historicalData.map(entry => entry.priceUsd);
            
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
                    { name: 'Cryptocurrency', value: cryptoData.name, inline: true },
                    { name: 'Symbol', value: cryptoData.symbol.toUpperCase(), inline: true },
                    { name: 'Price', value: `$${priceInUsd.toFixed(2)}`, inline: true }
                )
                .setColor('#0099ff')
                .setImage(chartUrl) // Add chart image to the embed
                .setFooter({ text: 'HackSaw Crypto API', iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching crypto data:', error);
            await interaction.reply({ content: 'An error occurred while fetching the cryptocurrency data. Please try again later.', ephemeral: true });
        }
    },
};

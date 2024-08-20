const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'crypto',
    description: 'Get the current price of a cryptocurrency and its historical chart',
    options: [
        {
            name: 'coin',
            type: 3, // STRING
            description: 'The cryptocurrency to check',
            required: true,
            choices: []
        },
        {
            name: 'interval',
            type: 3, // STRING
            description: 'The time interval for historical data',
            required: true,
            choices: [
                { name: '1 minute', value: 'm1' },
                { name: '5 minutes', value: 'm5' },
                { name: '15 minutes', value: 'm15' },
                { name: '30 minutes', value: 'm30' },
                { name: '1 hour', value: 'h1' },
                { name: '2 hours', value: 'h2' },
                { name: '6 hours', value: 'h6' },
                { name: '12 hours', value: 'h12' },
                { name: '1 day', value: 'd1' }
            ]
        }
    ],
    async execute(interaction) {
        try {
            // Fetch the list of available cryptocurrencies from CoinCap API
            const { data: coinsData } = await axios.get('https://api.coincap.io/v2/assets');
            if (!coinsData || !coinsData.data) {
                await interaction.reply({ content: 'Could not fetch the list of available cryptocurrencies. Please try again later.', ephemeral: true });
                return;
            }

            // Update the 'coin' option choices with the available cryptocurrencies
            interaction.options.get('coin').choices = coinsData.data.map(coin => ({
                name: `${coin.name} (${coin.symbol.toUpperCase()})`,
                value: coin.id
            }));

            // Get the selected cryptocurrency and interval
            const coin = interaction.options.getString('coin');
            const interval = interaction.options.getString('interval');

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

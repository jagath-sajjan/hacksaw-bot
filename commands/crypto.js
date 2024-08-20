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
            autocomplete: true // Enable autocomplete
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
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        try {
            // Fetch list of coins from CoinGecko
            const response = await axios.get('https://api.coingecko.com/api/v3/coins/list');
            const coins = response.data;

            // Filter coins based on the focused value (what the user is typing)
            const filtered = coins
                .filter(coin => coin.name.toLowerCase().includes(focusedValue.toLowerCase()))
                .slice(0, 25);

            // Send autocomplete response with the filtered coins
            await interaction.respond(filtered.map(coin => ({ name: coin.name, value: coin.id })));
        } catch (error) {
            console.error('Error fetching coin list:', error);
            await interaction.respond([]);
        }
    },
    async execute(interaction) {
        try {
            // Get the selected cryptocurrency and interval
            const coinId = interaction.options.getString('coin');
            const interval = interaction.options.getString('interval');

            // Fetch cryptocurrency data from CoinGecko
            const { data } = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}`);
            if (!data) {
                await interaction.reply({ content: `Could not find data for ${coinId}. Please check the coin name and try again.`, ephemeral: true });
                return;
            }
            const cryptoData = data;
            const priceInUsd = parseFloat(cryptoData.market_data.current_price.usd); // Price in USD

            // Fetch historical data for chart
            const historicalDataResponse = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=30`);
            if (!historicalDataResponse.data || !historicalDataResponse.data.prices) {
                await interaction.reply({ content: `Could not fetch historical data for ${coinId}.`, ephemeral: true });
                return;
            }
            const historicalData = historicalDataResponse.data.prices;
            const labels = historicalData.map(entry => new Date(entry[0]).toLocaleDateString());
            const prices = historicalData.map(entry => entry[1]);

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

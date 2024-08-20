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
            choices: [
                { name: 'Bitcoin (BTC)', value: 'bitcoin' },
                { name: 'Ethereum (ETH)', value: 'ethereum' },
                { name: 'Tether (USDT)', value: 'tether' },
                { name: 'USD Coin (USDC)', value: 'usd-coin' },
                { name: 'Binance Coin (BNB)', value: 'binancecoin' },
                { name: 'XRP (XRP)', value: 'xrp' },
                { name: 'Solana (SOL)', value: 'solana' },
                { name: 'Cardano (ADA)', value: 'cardano' },
                { name: 'Dogecoin (DOGE)', value: 'dogecoin' },
                { name: 'Polygon (MATIC)', value: 'matic-network' },
                { name: 'Polkadot (DOT)', value: 'polkadot' },
                { name: 'Shiba Inu (SHIB)', value: 'shiba-inu' },
                { name: 'Avalanche (AVAX)', value: 'avalanche-2' },
                { name: 'Litecoin (LTC)', value: 'litecoin' },
                { name: 'Uniswap (UNI)', value: 'uniswap' },
                { name: 'Chainlink (LINK)', value: 'chainlink' },
                { name: 'NEAR Protocol (NEAR)', value: 'near' },
                { name: 'Cosmos (ATOM)', value: 'cosmos' },
                { name: 'Monero (XMR)', value: 'monero' },
                { name: 'Wrapped Bitcoin (WBTC)', value: 'wrapped-bitcoin' },
                { name: 'Internet Computer (ICP)', value: 'internet-computer' },
                { name: 'The Sandbox (SAND)', value: 'the-sandbox' },
                { name: 'Axie Infinity (AXS)', value: 'axie-infinity' },
                { name: 'Decentraland (MANA)', value: 'decentraland' },
                { name: 'Stellar (XLM)', value: 'stellar' },
                { name: 'Tron (TRX)', value: 'tron' },
                { name: 'Algorand (ALGO)', value: 'algorand' },
                { name: 'Curve DAO Token (CRV)', value: 'curve-dao-token' },
                { name: 'Aave (AAVE)', value: 'aave' },
                { name: 'Filecoin (FIL)', value: 'filecoin' },
                { name: 'Compound (COMP)', value: 'compound-governance-token' },
                { name: 'Flow (FLOW)', value: 'flow' },
                { name: 'Maker (MKR)', value: 'maker' },
                { name: 'Klaytn (KLAY)', value: 'klaytn' },
                { name: 'Neo (NEO)', value: 'neo' },
                { name: 'Fantom (FTM)', value: 'fantom' },
                { name: 'Theta Network (THETA)', value: 'theta-network' },
                { name: 'Helium (HNT)', value: 'helium' },
                { name: 'Quant (QNT)', value: 'quant-network' },
                { name: 'Harmony (ONE)', value: 'harmony' },
                { name: 'Waves (WAVES)', value: 'waves' },
                { name: 'Zcash (ZEC)', value: 'zcash' },
                { name: 'Celsius (CEL)', value: 'celsius-network' },
                { name: 'Synthetix Network Token (SNX)', value: 'synthetix-network-token' },
                { name: 'Dai (DAI)', value: 'dai' },
                { name: 'Loopring (LRC)', value: 'loopring' },
                { name: 'Osmosis (OSMO)', value: 'osmosis' },
                { name: 'Ethereum Classic (ETC)', value: 'ethereum-classic' },
                { name: 'Kusama (KSM)', value: 'kusama' },
                { name: 'TerraUSD (UST)', value: 'terrausd' },
                { name: 'Apecoin (APE)', value: 'apecoin' },
                { name: 'Kraken Token (KRN)', value: 'kraken-token' },
                { name: 'Convex Finance (CVX)', value: 'convex-finance' },
                { name: 'Mina Protocol (MINA)', value: 'mina-protocol' },
                { name: 'PancakeSwap (CAKE)', value: 'pancakeswap-token' },
                { name: 'Huobi Token (HT)', value: 'huobi-token' },
                { name: 'Ecash (XEC)', value: 'ecash' },
                { name: 'Gnosis (GNO)', value: 'gnosis' },
                { name: 'Audius (AUDIO)', value: 'audius' },
                { name: 'TerraLuna Classic (LUNC)', value: 'terra-luna-classic' },
                { name: 'Bitcoin Cash (BCH)', value: 'bitcoin-cash' },
                { name: 'Optimism (OP)', value: 'optimism' },
                { name: 'Stacks (STX)', value: 'stacks' },
                { name: 'Gala (GALA)', value: 'gala' },
                { name: 'Kava (KAVA)', value: 'kava' },
                { name: 'IOTA (MIOTA)', value: 'iota' },
                { name: 'Elrond (EGLD)', value: 'elrond-egld' },
                { name: 'Arweave (AR)', value: 'arweave' },
                { name: 'Lido DAO (LDO)', value: 'lido-dao' },
                { name: 'Frax (FRAX)', value: 'frax' },
                { name: 'Kadena (KDA)', value: 'kadena' },
                { name: 'Enjin Coin (ENJ)', value: 'enjin-coin' },
                { name: 'Anchor Protocol (ANC)', value: 'anchor-protocol' },
                { name: 'Render Token (RNDR)', value: 'render-token' },
                { name: 'Zilliqa (ZIL)', value: 'zilliqa' },
                { name: 'Cronos (CRO)', value: 'cronos' },
                { name: 'Ethereum Name Service (ENS)', value: 'ethereum-name-service' },
                { name: 'Chiliz (CHZ)', value: 'chiliz' },
                { name: 'STEPN (GMT)', value: 'stepn' },
                { name: 'Sushi (SUSHI)', value: 'sushi' },
                { name: 'Cosmos Hub (ATOM)', value: 'cosmos' },
                { name: 'Nexo (NEXO)', value: 'nexo' },
                { name: 'Radix (XRD)', value: 'radix' },
                { name: 'Amp (AMP)', value: 'amp-token' },
                { name: 'Waves Enterprise (WEST)', value: 'waves-enterprise' },
                { name: 'Celo (CELO)', value: 'celo' },
                { name: 'Klaytn Governance Token (KGT)', value: 'klaytn-governance-token' },
                { name: 'Lido Staked ETH (stETH)', value: 'lido-staked-ether' },
                { name: 'SushiSwap (SUSHI)', value: 'sushiswap' },
                { name: 'Huobi BTC (HBTC)', value: 'huobi-btc' },
                { name: 'Dydx (DYDX)', value: 'dydx' },
                { name: 'Astar (ASTR)', value: 'astar' },
                { name: 'Livepeer (LPT)', value: 'livepeer' },
                { name: 'Bitget Token (BGB)', value: 'bitget-token' },
                { name: 'Fetch.ai (FET)', value: 'fetch-ai' },
                { name: 'THORChain (RUNE)', value: 'thorchain' },
                { name: 'Thorswap (THOR)', value: 'thorswap' },
                { name: 'Arive (ARIVE)', value: 'arive' },
                { name: 'Conflux (CFX)', value: 'conflux-network' },
                { name: 'Oasis Network (ROSE)', value: 'oasis-network' },
                { name: 'Grimace Coin (GRM)', value: 'grimace-coin' }
            ]
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

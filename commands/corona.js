const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');

module.exports = {
    name: 'corona',
    description: 'Get COVID-19 statistics for a specific country',
    data: new SlashCommandBuilder()
        .setName('corona')
        .setDescription('Get COVID-19 statistics for a specific country')
        .addStringOption(option =>
            option.setName('country')
                .setDescription('The country to get COVID-19 statistics for')
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply();

        const country = interaction.options.getString('country');

        try {
            const response = await fetch(`https://covid19.mathdro.id/api/countries/${country}`);
            const data = await response.json();

            if (data.error) {
                return interaction.editReply(`Invalid country provided: ${country}`);
            }

            const confirmed = data.confirmed.value.toLocaleString();
            const recovered = data.recovered.value.toLocaleString();
            const deaths = data.deaths.value.toLocaleString();

            const embed = {
                color: 0x0099ff,
                title: `💉 COVID-19 - ${country}`,
                fields: [
                    {
                        name: "✅ Confirmed Cases",
                        value: confirmed,
                        inline: true,
                    },
                    {
                        name: "🤗 Recovered",
                        value: recovered,
                        inline: true,
                    },
                    {
                        name: "💀 Deaths",
                        value: deaths,
                        inline: true,
                    },
                ],
                timestamp: new Date(),
                footer: {
                    text: 'Data from covid19.mathdro.id'
                }
            };

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching COVID-19 data:', error);
            await interaction.editReply('An error occurred while fetching COVID-19 data. Please try again later.');
        }
    },
};

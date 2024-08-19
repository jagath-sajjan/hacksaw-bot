const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'ip',
    description: 'Fetch information about a given IP address',
    options: [
        {
            name: 'address',
            type: 3, // STRING
            description: 'The IP address to look up',
            required: true
        }
    ],
    async execute(interaction) {
        await interaction.deferReply();
        try {
            const ipAddress = interaction.options.getString('address');
            const response = await axios.get(`http://ip-api.com/json/${ipAddress}`);
            const data = response.data;

            if (data.status === 'success') {
                const embed = new EmbedBuilder()
                    .setTitle(`IP Information: ${ipAddress}`)
                    .addFields(
                        { name: 'Country', value: data.country || 'N/A', inline: true },
                        { name: 'Region', value: data.regionName || 'N/A', inline: true },
                        { name: 'City', value: data.city || 'N/A', inline: true },
                        { name: 'ZIP', value: data.zip || 'N/A', inline: true },
                        { name: 'Latitude', value: data.lat?.toString() || 'N/A', inline: true },
                        { name: 'Longitude', value: data.lon?.toString() || 'N/A', inline: true },
                        { name: 'ISP', value: data.isp || 'N/A', inline: true },
                        { name: 'Organization', value: data.org || 'N/A', inline: true },
                        { name: 'AS', value: data.as || 'N/A', inline: true },
                        { name: 'Timezone', value: data.timezone || 'N/A', inline: true }
                    )
                    .setColor('Green')
                    .setFooter({ text: 'HackSaw Internet Protocol API.', iconURL: interaction.client.user.displayAvatarURL() });

                await interaction.editReply({ embeds: [embed] });
            } else {
                await interaction.editReply(`Failed to fetch information for IP: ${ipAddress}. Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error in IP lookup:', error);
            await interaction.editReply('An error occurred while fetching IP information.');
        }
    },
};

const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Show bot latency',
    async execute(interaction) {
        await interaction.deferReply();
        try {
            const sent = await interaction.fetchReply();
            const roundtripLatency = sent.createdTimestamp - interaction.createdTimestamp;
            const wsLatency = interaction.client.ws.ping;

            const embed = new EmbedBuilder()
                .setTitle('Ping Information')
                .addFields(
                    { name: 'Roundtrip Latency', value: `${roundtripLatency}ms`, inline: true },
                    { name: 'WebSocket Latency', value: `${wsLatency}ms`, inline: true }
                )
                .setColor('Green')
                .setFooter({ text: 'Pinging HackSaw API.', iconURL: interaction.client.user.displayAvatarURL() });

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Error in ping command:', error);
            await interaction.editReply('An error occurred while fetching ping information.');
        }
    },
};

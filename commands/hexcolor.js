const Discord = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'hexcolor',
    description: 'Get information about a hex color',
    options: [
        {
            name: 'color',
            description: 'The hex color code (without #)',
            type: 3,
            required: true
        }
    ],
    async execute(interaction) {
        const color = interaction.options.getString('color');

        try {
            const { data } = await axios.get(
                `https://some-random-api.com/canvas/rgb?hex=${color}`
            );

            const embed = new Discord.EmbedBuilder()
                .setTitle('🎨・Color info')
                .setImage(`https://some-random-api.com/canvas/colorviewer?hex=${color}`)
                .setColor(`#${color}`)
                .addFields(
                    { name: "Hex", value: `#${color}`, inline: true },
                    { name: "RGB", value: `${data.r}, ${data.g}, ${data.b}`, inline: true }
                );

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            await interaction.reply({ content: "Color not found!", ephemeral: true });
        }
    }
};

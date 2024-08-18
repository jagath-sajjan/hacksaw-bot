module.exports = {
    name: 'simp-rate',
    description: 'Calculates your simp rate',
    execute: async (interaction) => {
        var result = Math.ceil(Math.random() * 100);

        await interaction.reply({
            embeds: [{
                title: `👀・Simp rate`,
                description: `You are ${result}% simp!`,
                color: 0x3498db // You can change this color code as needed
            }]
        });
    }
};

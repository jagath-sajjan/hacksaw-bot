module.exports = {
    name: 'howgay',
    description: 'Check how gay someone is',
    execute: async (interaction) => {
        var result = Math.ceil(Math.random() * 100);

        await interaction.reply({
            embeds: [{
                title: `🏳️‍🌈・Gay rate`,
                description: `You are ${result}% gay!`,
                color: 0x00FFFF // You can change this color code as needed
            }]
        });
    }
};

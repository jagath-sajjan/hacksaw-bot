module.exports = {
    name: 'stankrate',
    description: 'Rates how stanky you are on a scale of 0-100%',
    execute: async (interaction) => {
        var result = Math.ceil(Math.random() * 100);

        await interaction.reply({
            embeds: [{
                title: `💨・Stank rate`,
                description: `You are ${result}% stanky!`,
                color: 0x00FF00 // Green color, you can change this
            }]
        });
    }
};

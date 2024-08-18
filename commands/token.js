const Discord = require('discord.js');
const fetch = require("node-fetch");

module.exports = {
    name: 'token',
    description: 'Generate a bot token for the user',
    async execute(interaction) {
        try {
            const response = await fetch(`https://some-random-api.com/bottoken?id=${interaction.user.id}`);
            const json = await response.json();

            await interaction.reply({
                embeds: [{
                    title: `🤖・Bot token`,
                    description: json.token,
                    color: 0x3498db // You can change this color as needed
                }],
                ephemeral: true // This makes the response visible only to the user who used the command
            });
        } catch (error) {
            console.error('Error fetching bot token:', error);
            await interaction.reply({
                content: 'An error occurred while generating the bot token.',
                ephemeral: true
            });
        }
    },
};

const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'roll',
    description: 'Roll a die',
    options: [
        {
            name: 'sides',
            type: 4,
            description: 'Number of sides on the die',
            required: true
        }
    ],
    async execute(interaction) {
        const sides = interaction.options.getInteger('sides');

        if (sides < 2) {
            return interaction.reply('A die must have at least 2 sides.');
        }

        const result = Math.floor(Math.random() * sides) + 1;

        const embed = new EmbedBuilder()
            .setTitle('🎲 Dice Roll')
            .setDescription(`You rolled a **${result}** on a ${sides}-sided die.`)
            .setColor('Random')
            .setFooter({ text: 'HackSaw Roll API', iconURL: interaction.client.user.displayAvatarURL() });

        await interaction.reply({ embeds: [embed] });
    },
};

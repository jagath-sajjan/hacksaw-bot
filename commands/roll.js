const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'roll',
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Roll a die')
        .addIntegerOption(option =>
            option.setName('sides')
                .setDescription('Number of sides on the die')
                .setRequired(true)),

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
            .setFooter({ text: 'Made By Jagath🩵' });

        await interaction.reply({ embeds: [embed] });
    },
};

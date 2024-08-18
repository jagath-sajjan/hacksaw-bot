const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Show all available commands',
    async execute(interaction) {
        await interaction.deferReply();
        try {
            const categories = [
                {
                    name: '📊 Utility',
                    value: 'utility',
                    commands: ['ping', 'help', 'botinfo', 'time', 'ip', 'pass-gen', 'qr', 'convert', 'hexcolor', 'crypto', 'weather', 'token']
                },
                {
                    name: '🔎 Search',
                    value: 'search',
                    commands: ['bing', 'ddg', 'google', 'youtube', 'github', 'itunes']
                },
                {
                    name: '📝 Language & Text',
                    value: 'language',
                    commands: ['dic', 'anagram', 'ascii', 'translate']
                },
                {
                    name: '🔤 Morse Code',
                    value: 'morse',
                    commands: ['morse', 'demorse', 'ligmorse', 'smorse', 'learn']
                },
                {
                    name: '🎲 Fun & Games',
                    value: 'fun',
                    commands: ['coin-flip', 'roll', 'dino', 'fact', 'gif', 'hack', 'howgay', 'kill', 'lovemeter', 'roast', 'simp-rate', 'stankrate']
                }
            ];

            const select = new StringSelectMenuBuilder()
                .setCustomId('category')
                .setPlaceholder('Select a category')
                .addOptions(
                    categories.map(category => 
                        new StringSelectMenuOptionBuilder()
                            .setLabel(category.name)
                            .setValue(category.value)
                    )
                );

            const row = new ActionRowBuilder().addComponents(select);

            const initialEmbed = new EmbedBuilder()
                .setTitle('Help Menu')
                .setDescription('Please select a category from the dropdown menu below to see available commands.')
                .setColor('Green')
                .setFooter({ text: 'Made By Jagath🩵' });

            const response = await interaction.editReply({
                embeds: [initialEmbed],
                components: [row],
            });

            const collector = response.createMessageComponentCollector({
                componentType: ComponentType.StringSelect,
                time: 3_600_000, // 1 hour
            });

            collector.on('collect', async i => {
                if (i.user.id !== interaction.user.id) {
                    return i.reply({ content: 'This menu is not for you!', ephemeral: true });
                }

                const selectedCategory = categories.find(cat => cat.value === i.values[0]);
                const commandList = selectedCategory.commands.map(cmd => `\`/${cmd}\``).join(', ');

                const categoryEmbed = new EmbedBuilder()
                    .setTitle(`${selectedCategory.name} Commands`)
                    .setDescription(`Here are the commands in the ${selectedCategory.name} category:\n\n${commandList}`)
                    .setColor('Green')
                    .setFooter({ text: 'Made By Jagath🩵' });

                await i.update({ embeds: [categoryEmbed], components: [row] });
            });

            collector.on('end', () => {
                interaction.editReply({ components: [] });
            });

        } catch (error) {
            console.error('Error in help command:', error);
            await interaction.editReply('An error occurred while fetching the help information.');
        }
    },
};

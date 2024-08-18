const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Show all available commands',
    async execute(interaction) {
        await interaction.deferReply();
        try {
            const embed = new EmbedBuilder()
                .setTitle('Available Commands')
                .setColor('Green')
                .setDescription('Here are all the available commands, categorized for easy reference:')
                .setFooter({ text: 'Made By Jagath🩵' });

            const categories = [
                {
                    name: '📊 Utility',
                    commands: [
                        { name: 'ping', desc: 'Bot latency' },
                        { name: 'help', desc: 'Show commands' },
                        { name: 'botinfo', desc: 'Bot info' },
                        { name: 'time', desc: 'Get time' },
                        { name: 'ip', desc: 'IP info' },
                        { name: 'pass-gen', desc: 'Generate password' }
                    ]
                },
                {
                    name: '💬 Communication',
                    commands: [
                        { name: 'qr', desc: 'Generate QR code' },
                        { name: 'gif', desc: 'Send GIF' }
                    ]
                },
                {
                    name: '📝 Language & Text',
                    commands: [
                        { name: 'dic', desc: 'Word definition' },
                        { name: 'anagram', desc: 'Find anagrams' },
                        { name: 'convert', desc: 'Convert units' }
                    ]
                },
                {
                    name: '🔤 Morse Code',
                    commands: [
                        { name: 'morse', desc: 'Text to Morse' },
                        { name: 'demorse', desc: 'Morse to text' },
                        { name: 'ligmorse', desc: 'Visual Morse' },
                        { name: 'smorse', desc: 'Audio Morse' },
                        { name: 'learn', desc: 'Learn Morse' }
                    ]
                },
                {
                    name: '🎲 Fun & Games',
                    commands: [
                        { name: 'coin-flip', desc: 'Flip a coin' },
                        { name: 'roll', desc: 'Roll a die' }
                    ]
                }
            ];

            categories.forEach(category => {
                let fieldValue = category.commands.map(cmd => 
                    `\`/${cmd.name}\` - ${cmd.desc}`
                ).join('\n');
                embed.addFields({ name: category.name, value: fieldValue });
            });

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Error in help command:', error);
            await interaction.editReply('An error occurred while fetching the help information.');
        }
    },
};
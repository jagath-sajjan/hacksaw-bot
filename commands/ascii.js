const figlet = require('figlet');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ascii',
    description: 'Generate ASCII art from text',
    options: [
        {
            name: 'text',
            type: 3, // STRING
            description: 'The text to convert to ASCII art',
            required: true
        }
    ],
    async execute(interaction) {
        await interaction.deferReply();
        try {
            const text = interaction.options.getString('text');
            if (!text) {
                await interaction.editReply("Please provide text to convert to ASCII art.");
                return;
            }
            if (text.length > 2000) {
                await interaction.editReply("Please provide text shorter than 2000 characters!");
                return;
            }

            figlet.text(text, (err, data) => {
                if (err) {
                    console.error('Error in figlet:', err);
                    interaction.editReply(`An error occurred while generating ASCII art: ${err.message}`);
                    return;
                }

                if (!data) {
                    console.error('Figlet produced no data');
                    interaction.editReply("An error occurred: No ASCII art was generated.");
                    return;
                }

                const embed = new EmbedBuilder()
                    .setTitle('💬 ASCII Art')
                    .setDescription(`\`\`\`${data}\`\`\``)
                    .setColor('Random')
                    .setFooter({ text: 'HackSaw Ascii API.', iconURL: interaction.client.user.displayAvatarURL() })
                    .setTimestamp(Date.now() + ms(timeAdded));

                embed.addFields({ name: 'Note', value: 'Use a computer/laptop to view the results properly' });

                interaction.editReply({ embeds: [embed] }).catch(error => {
                    console.error('Error sending embed:', error);
                    interaction.editReply("An error occurred while sending the ASCII art. It might be too large for Discord.");
                });
            });
        } catch (error) {
            console.error('Error in handleAscii:', error);
            await interaction.editReply(`An error occurred while processing the ASCII command: ${error.message}`);
        }
    },
};

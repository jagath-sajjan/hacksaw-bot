const { SlashCommandBuilder } = require('discord.js');
const translate = require('@iamtraction/google-translate');

module.exports = {
    name: 'translate',
    description: 'Translate text to a specified language',
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription('Translate text to a specified language')
        .addStringOption(option =>
            option.setName('language')
                .setDescription('The language to translate to (ISO code)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('text')
                .setDescription('The text to translate')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();

        const language = interaction.options.getString('language');
        const text = interaction.options.getString('text');

        try {
            const res = await translate(text, { to: language });
            
            const embed = {
                color: 0x0099ff,
                title: '✅ Translation Successful',
                fields: [
                    {
                        name: '📥 Input',
                        value: text,
                    },
                    {
                        name: '📤 Output',
                        value: res.text,
                    },
                ],
                timestamp: new Date(),
            };

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.editReply('An error occurred while translating. Please make sure you provided a valid ISO language code.');
        }
    },
};

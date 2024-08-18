const Discord = require('discord.js');
const translate = require('@iamtraction/google-translate');

module.exports = {
    name: 'translate',
    description: 'Translate text to a specified language',
    options: [
        {
            name: 'language',
            description: 'The target language (ISO code)',
            type: 3,
            required: true
        },
        {
            name: 'text',
            description: 'The text to translate',
            type: 3,
            required: true
        }
    ],
    async execute(interaction) {
        const language = interaction.options.getString('language');
        const text = interaction.options.getString('text');

        try {
            const res = await translate(text, { to: language });
            
            const embed = new Discord.EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Translation Result')
                .addFields(
                    { name: '📥 Input', value: text, inline: false },
                    { name: '📤 Output', value: res.text, inline: false },
                    { name: 'Source Language', value: res.from.language.iso, inline: true },
                    { name: 'Target Language', value: language, inline: true }
                )
                .setFooter({ text: 'Powered by Google Translate' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Translation error:', error);
            await interaction.reply({ 
                content: 'An error occurred while translating. Please make sure you provided a valid ISO language code.',
                ephemeral: true
            });
        }
    }
};

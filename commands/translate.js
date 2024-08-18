const { SlashCommandBuilder } = require('discord.js');
const translate = require('@iamtraction/google-translate');

const languageOptions = [
    { name: 'English', value: 'en' },
    { name: 'Spanish', value: 'es' },
    { name: 'French', value: 'fr' },
    { name: 'German', value: 'de' },
    { name: 'Italian', value: 'it' },
    { name: 'Portuguese', value: 'pt' },
    { name: 'Russian', value: 'ru' },
    { name: 'Chinese (Simplified)', value: 'zh-CN' },
    { name: 'Japanese', value: 'ja' },
    { name: 'Korean', value: 'ko' },
    { name: 'Arabic', value: 'ar' },
    { name: 'Hindi', value: 'hi' },
    { name: 'Dutch', value: 'nl' },
    { name: 'Greek', value: 'el' },
    { name: 'Polish', value: 'pl' },
    { name: 'Turkish', value: 'tr' },
    { name: 'Vietnamese', value: 'vi' },
    { name: 'Thai', value: 'th' },
    { name: 'Indonesian', value: 'id' },
    { name: 'Malay', value: 'ms' },
    { name: 'Swedish', value: 'sv' },
    { name: 'Danish', value: 'da' },
    { name: 'Finnish', value: 'fi' },
    { name: 'Norwegian', value: 'no' },
    { name: 'Czech', value: 'cs' }
];

module.exports = {
    name: 'translate',
    description: 'Translate text to a specified language',
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription('Translate text to a specified language')
        .addStringOption(option =>
            option.setName('language')
                .setDescription('The language to translate to')
                .setRequired(true)
                .addChoices(...languageOptions)
                .setAutocomplete(true))
        .addStringOption(option =>
            option.setName('text')
                .setDescription('The text to translate')
                .setRequired(true)),
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused().toLowerCase();
        const filtered = languageOptions.filter(choice => 
            choice.name.toLowerCase().includes(focusedValue) || 
            choice.value.toLowerCase().includes(focusedValue)
        );
        await interaction.respond(
            filtered.map(choice => ({ name: choice.name, value: choice.value }))
        );
    },
    async execute(interaction) {
        await interaction.deferReply();
        const language = interaction.options.getString('language');
        const text = interaction.options.getString('text');

        try {
            const res = await translate(text, { to: language });
            
            const targetLanguage = languageOptions.find(lang => lang.value === language)?.name || language;
            
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
                    {
                        name: '🌐 Target Language',
                        value: targetLanguage,
                    },
                ],
                timestamp: new Date(),
            };
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.editReply('An error occurred while translating. Please make sure you\'ve entered a valid language code or selected a language from the list.');
        }
    },
};

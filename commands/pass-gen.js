const { EmbedBuilder } = require('discord.js');
const crypto = require('crypto');

module.exports = {
    name: 'pass-gen',
    description: 'Generate a secure random password',
    options: [
        {
            name: 'length',
            type: 4, // INTEGER
            description: 'Length of the password (default: 12, min: 8, max: 128)',
            required: false
        },
        {
            name: 'uppercase',
            type: 5, // BOOLEAN
            description: 'Include uppercase letters (default: true)',
            required: false
        },
        {
            name: 'lowercase',
            type: 5, // BOOLEAN
            description: 'Include lowercase letters (default: true)',
            required: false
        },
        {
            name: 'numbers',
            type: 5, // BOOLEAN
            description: 'Include numbers (default: true)',
            required: false
        },
        {
            name: 'symbols',
            type: 5, // BOOLEAN
            description: 'Include symbols (default: true)',
            required: false
        }
    ],
    async execute(interaction) {
        const length = interaction.options.getInteger('length') || 12;
        const uppercase = interaction.options.getBoolean('uppercase') ?? true;
        const lowercase = interaction.options.getBoolean('lowercase') ?? true;
        const numbers = interaction.options.getBoolean('numbers') ?? true;
        const symbols = interaction.options.getBoolean('symbols') ?? true;

        if (length < 8 || length > 128) {
            await interaction.reply('Password length must be between 8 and 128 characters.');
            return;
        }

        const password = generatePassword(length, uppercase, lowercase, numbers, symbols);

        const embed = new EmbedBuilder()
            .setTitle('Password Generator')
            .setDescription(`Here's your generated password:`)
            .addFields({ name: 'Password', value: `||${password}||` })
            .setColor('Green')
            .setFooter({ text: 'HackSaw Pass-Gen API', iconURL: interaction.client.user.displayAvatarURL() });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};

function generatePassword(length, uppercase, lowercase, numbers, symbols) {
    let charset = '';
    if (uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers) charset += '0123456789';
    if (symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (charset === '') {
        charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    }

    let password = '';
    const randomBytes = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
        password += charset[randomBytes[i] % charset.length];
    }
    return password;
}

const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Ban a user from the server',
    options: [
        {
            name: 'user',
            type: 6, // USER
            description: 'The user to ban',
            required: true
        },
        {
            name: 'reason',
            type: 3, // STRING
            description: 'The reason for banning the user',
            required: false
        }
    ],
    async execute(interaction) {
        // Check if the user has the required permissions
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers) &&
            !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const userToBan = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        try {
            await interaction.guild.members.ban(userToBan, { reason });

            const embed = new EmbedBuilder()
                .setTitle('User Banned')
                .addFields(
                    { name: 'Banned User', value: userToBan.tag },
                    { name: 'Banned By', value: interaction.user.tag },
                    { name: 'Reason', value: reason }
                )
                .setColor('Red')
                .setFooter({ text: 'Made By Jagath🩵' });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error banning user:', error);
            await interaction.reply({ content: 'An error occurred while trying to ban the user.', ephemeral: true });
        }
    },
};

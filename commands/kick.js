const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'kick',
    description: 'Kick a member from the server',
    options: [
        {
            name: 'user',
            type: 6, // USER
            description: 'The user to kick',
            required: true
        },
        {
            name: 'reason',
            type: 3, // STRING
            description: 'The reason for kicking the user',
            required: false
        }
    ],
    async execute(interaction) {
        // Check if the user has the required permissions
        if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers) && 
            !interaction.member.permissions.has(PermissionFlagsBits.ManageGuild) && 
            !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const targetUser = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

        if (!targetMember) {
            return interaction.reply({ content: 'Unable to find the specified user in this server.', ephemeral: true });
        }

        if (!targetMember.kickable) {
            return interaction.reply({ content: 'I do not have permission to kick this user.', ephemeral: true });
        }

        try {
            await targetMember.kick(reason);

            const embed = new EmbedBuilder()
                .setTitle('User Kicked')
                .addFields(
                    { name: 'Kicked User', value: targetUser.tag },
                    { name: 'Kicked By', value: interaction.user.tag },
                    { name: 'Reason', value: reason }
                )
                .setColor('Red')
                .setFooter({ text: 'Made By Jagath🩵' });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error kicking user:', error);
            await interaction.reply({ content: 'An error occurred while trying to kick the user.', ephemeral: true });
        }
    },
};

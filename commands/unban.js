const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'unban',
    description: 'Unban a user from the server',
    options: [
        {
            name: 'userid',
            type: 3, // STRING
            description: 'The ID of the user to unban',
            required: true
        },
        {
            name: 'reason',
            type: 3, // STRING
            description: 'The reason for unbanning the user',
            required: false
        }
    ],
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers) && 
            !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const userId = interaction.options.getString('userid');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        try {
            const unbannedUser = await interaction.guild.members.unban(userId, reason);

            const unbanEmbed = new EmbedBuilder()
                .setTitle('🎉 User Unbanned')
                .setDescription(`${unbannedUser.tag} has been unbanned from the server.`)
                .addFields(
                    { name: '👤 Unbanned User', value: unbannedUser.tag, inline: true },
                    { name: '🛡️ Unbanned By', value: interaction.user.tag, inline: true },
                    { name: '📝 Reason', value: reason }
                )
                .setColor('#00FF00')
                .setThumbnail(unbannedUser.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setFooter({ text: 'Made By Jagath🩵', iconURL: interaction.client.user.displayAvatarURL() })
                .setImage('https://tenor.com/view/you-are-now-unbanned-gif-16231818107758749185');

            const reply = await interaction.reply({ embeds: [unbanEmbed], fetchReply: true });

            // Delete the embed after 20 seconds
            setTimeout(() => {
                reply.delete().catch(console.error);
            }, 20000);

            // DM the unbanned user if their DMs are open
            const dmEmbed = new EmbedBuilder()
                .setTitle('You have been unbanned! 🎊')
                .setDescription(`You were unbanned from ${interaction.guild.name}`)
                .addFields(
                    { name: '📝 Reason', value: reason }
                )
                .setColor('#00FF00')
                .setTimestamp()
                .setFooter({ text: 'Made By Jagath🩵', iconURL: interaction.client.user.displayAvatarURL() })
                .setImage('https://tenor.com/view/you-are-now-unbanned-gif-16231818107758749185');

            try {
                await unbannedUser.send({ embeds: [dmEmbed] });
            } catch (error) {
                console.log(`Could not send DM to ${unbannedUser.tag}`);
            }

        } catch (error) {
            console.error('Error unbanning user:', error);
            await interaction.reply({ content: 'An error occurred while trying to unban the user. Make sure the user ID is correct.', ephemeral: true });
        }
    },
};

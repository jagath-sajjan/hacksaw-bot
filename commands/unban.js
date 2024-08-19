const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a user from the server')
        .addStringOption(option =>
            option.setName('userid')
                .setDescription('The ID of the user to unban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for unbanning the user')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        const userId = interaction.options.getString('userid');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        try {
            await interaction.guild.members.unban(userId, reason);

            const unbanEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('🎉 User Unbanned 🎉')
                .setDescription(`<@${userId}> has been unbanned from the server.`)
                .addFields(
                    { name: 'User ID', value: userId, inline: true },
                    { name: 'Unbanned by', value: interaction.user.tag, inline: true },
                    { name: 'Reason', value: reason }
                )
                .setTimestamp()
                .setFooter({ text: 'User Unbanned', iconURL: interaction.guild.iconURL() });

            const reply = await interaction.reply({ embeds: [unbanEmbed], fetchReply: true });

            // Delete the embed after 20 seconds
            setTimeout(() => reply.delete().catch(console.error), 20000);

            // Try to DM the unbanned user
            try {
                const unbannedUser = await interaction.client.users.fetch(userId);
                const dmEmbed = new EmbedBuilder()
                    .setColor('#00FF00')
                    .setTitle('You\'ve Been Unbanned! 🎊')
                    .setDescription(`You have been unbanned from ${interaction.guild.name}`)
                    .addFields(
                        { name: 'Reason', value: reason },
                        { name: 'Unbanned by', value: interaction.user.tag }
                    )
                    .setImage('https://tenor.com/view/you-are-now-unbanned-gif-16231818107758749185')
                    .setTimestamp()
                    .setFooter({ text: 'Welcome back!', iconURL: interaction.guild.iconURL() });

                await unbannedUser.send({ embeds: [dmEmbed] });
            } catch (error) {
                console.error('Failed to send DM to unbanned user:', error);
            }

        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while trying to unban the user.', ephemeral: true });
        }
    },
};

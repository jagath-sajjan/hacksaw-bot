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

            const kickEmbed = new EmbedBuilder()
                .setTitle('👢 User Kicked')
                .setDescription(`${targetUser.tag} has been kicked from the server.`)
                .addFields(
                    { name: '👤 Kicked User', value: targetUser.tag, inline: true },
                    { name: '🛡️ Kicked By', value: interaction.user.tag, inline: true },
                    { name: '📝 Reason', value: reason }
                )
                .setColor('#FF4136')
                .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setFooter({ text: 'Made By Jagath🩵', iconURL: interaction.client.user.displayAvatarURL() })
                .setImage('https://media.discordapp.net/attachments/1118630713068818562/1118630713362419732/kick.gif');

            const reply = await interaction.reply({ embeds: [kickEmbed], fetchReply: true });

            // Delete the embed after 20 seconds
            setTimeout(() => {
                reply.delete().catch(console.error);
            }, 20000);

            // DM the kicked user if their DMs are open
            const dmEmbed = new EmbedBuilder()
                .setTitle('You have been kicked!')
                .setDescription(`You were kicked from ${interaction.guild.name}`)
                .addFields(
                    { name: '📝 Reason', value: reason }
                )
                .setColor('#FF4136')
                .setTimestamp()
                .setFooter({ text: 'Made By Jagath🩵', iconURL: interaction.client.user.displayAvatarURL() })
                .setImage('https://media.tenor.com/Oj3Ht_Ql1UIAAAAC/spongebob-squarepants-get-out.gif');

            try {
                await targetUser.send({ embeds: [dmEmbed] });
            } catch (error) {
                console.log(`Could not send DM to ${targetUser.tag}`);
            }

        } catch (error) {
            console.error('Error kicking user:', error);
            await interaction.reply({ content: 'An error occurred while trying to kick the user.', ephemeral: true });
        }
    },
};

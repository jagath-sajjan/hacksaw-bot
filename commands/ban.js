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
                .setTitle('🔨 User Banned')
                .setDescription(`${userToBan.tag} has been banned from the server.`)
                .addFields(
                    { name: 'Banned User', value: userToBan.tag, inline: true },
                    { name: 'Banned By', value: interaction.user.tag, inline: true },
                    { name: 'Reason', value: reason }
                )
                .setColor('#FF0000')
                .setThumbnail(userToBan.displayAvatarURL({ dynamic: true }))
                .setImage('https://media.tenor.com/ZVbWtHIhQGcAAAAC/bane-no.gif')
                .setTimestamp()
                .setFooter({ text: 'HackSaw Ban API.', iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp(Date.now() + ms(timeAdded));

            const reply = await interaction.reply({ embeds: [embed], fetchReply: true });

            // Delete the embed after 20 seconds
            setTimeout(() => {
                reply.delete().catch(console.error);
            }, 20000);

            // Try to send a DM to the banned user
            try {
                const dmEmbed = new EmbedBuilder()
                    .setTitle('You have been banned')
                    .setDescription(`You have been banned from ${interaction.guild.name}`)
                    .addFields(
                        { name: 'Reason', value: reason }
                    )
                    .setColor('#FF0000')
                    .setImage('https://media.tenor.com/ZVbWtHIhQGcAAAAC/bane-no.gif')
                    .setTimestamp()
                    .setFooter({ text: 'Made By Jagath🩵', iconURL: interaction.client.user.displayAvatarURL() });

                await userToBan.send({ embeds: [dmEmbed] });
            } catch (error) {
                console.log(`Could not send DM to ${userToBan.tag}`);
            }

        } catch (error) {
            console.error('Error banning user:', error);
            await interaction.reply({ content: 'An error occurred while trying to ban the user.', ephemeral: true });
        }
    },
};

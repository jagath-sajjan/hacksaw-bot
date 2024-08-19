const Discord = require('discord.js');
const pop = require("popcat-wrapper");

module.exports = {
    name: 'github',
    description: 'Get information about a GitHub user',
    options: [
        {
            name: 'username',
            description: 'The GitHub username to look up',
            type: 3,
            required: true
        }
    ],
    async execute(interaction) {
        const username = interaction.options.getString('username');

        try {
            const r = await pop.github(username);

            const embed = new Discord.EmbedBuilder()
                .setTitle(`🏷️・${r.name}`)
                .setThumbnail(r.avatar)
                .setURL(r.url)
                .addFields(
                    { name: "💬┇Name", value: r.name, inline: true },
                    { name: "🧑‍💼┇Company", value: r.company || 'N/A', inline: true },
                    { name: "💬┇Bio", value: r.bio || 'N/A', inline: true },
                    { name: "📁┇Public Repositories", value: r.public_repos.toString(), inline: true },
                    { name: "⏰┇Created At", value: `<t:${Math.round(new Date(r.created_at).getTime() / 1000)}>`, inline: true }
                )
                .setFooter({ text: 'HackSaw Dictionary API.', iconURL: interaction.client.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            await interaction.reply({ content: `No account found with the username: ${username}`, ephemeral: true });
        }
    },
};

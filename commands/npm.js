const Discord = require('discord.js');
const pop = require("popcat-wrapper");

module.exports = {
    name: 'npm',
    description: 'Search for an npm package',
    options: [
        {
            name: 'name',
            description: 'The name of the npm package',
            type: 3,
            required: true
        }
    ],
    async execute(interaction) {
        const name = interaction.options.getString('name');

        try {
            const r = await pop.npm(name);

            const embed = new Discord.EmbedBuilder()
                .setTitle(`📁・${r.name}`)
                .addFields(
                    { name: "💬┇Name", value: r.name, inline: true },
                    { name: "🏷️┇Version", value: r.version, inline: true },
                    { name: "📃┇Description", value: r.description, inline: true },
                    { name: "⌨️┇Keywords", value: r.keywords.join(', ') || 'None', inline: true },
                    { name: "💻┇Author", value: r.author, inline: true },
                    { name: "📁┇Downloads", value: r.downloads_this_year.toString(), inline: true },
                    { name: "⏰┇Last publish", value: `<t:${Math.round(new Date(r.last_published).getTime() / 1000)}>`, inline: true }
                );

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            await interaction.reply({ content: "Package not found!", ephemeral: true });
        }
    },
};

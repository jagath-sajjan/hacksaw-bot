const Discord = require('discord.js');
const SteamAPI = require('steamapi');

const steam = new SteamAPI('YOUR_STEAM_API_KEY');

module.exports = {
    name: 'steam',
    description: 'Get information about a Steam game',
    options: [
        {
            name: 'name',
            description: 'The name of the Steam game',
            type: 3,
            required: true
        }
    ],
    async execute(interaction) {
        await interaction.deferReply();

        const name = interaction.options.getString('name');

        try {
            const game = await steam.getGameDetails(name);

            const embed = new Discord.EmbedBuilder()
                .setTitle(`🎮 ${game.name}`)
                .setThumbnail(game.header_image)
                .addFields(
                    { name: "💬┇Name", value: game.name, inline: true },
                    { name: "🏷️┇App ID", value: game.steam_appid.toString(), inline: true },
                    { name: "📃┇Description", value: game.short_description.slice(0, 1024), inline: false },
                    { name: "💻┇Developer", value: game.developers.join(', '), inline: true },
                    { name: "🏢┇Publisher", value: game.publishers.join(', '), inline: true },
                    { name: "📅┇Release Date", value: game.release_date.date, inline: true },
                    { name: "💲┇Price", value: game.is_free ? 'Free' : `$${game.price_overview?.final_formatted || 'N/A'}`, inline: true }
                )
                .setColor('#0099ff');

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: 'An error occurred while fetching the game information. Please check the game name and try again.' });
        }
    },
};

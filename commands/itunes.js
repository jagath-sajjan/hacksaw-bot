const Discord = require('discord.js');
const pop = require("popcat-wrapper");

module.exports = {
    name: 'itunes',
    description: 'Search for a song on iTunes',
    options: [
        {
            name: 'song',
            description: 'The name of the song to search for',
            type: 3,
            required: true
        }
    ],
    async execute(interaction) {
        const song = interaction.options.getString('song');

        try {
            const r = await pop.itunes(song);

            const embed = new Discord.EmbedBuilder()
                .setTitle(`🎶・${r.name}`)
                .setThumbnail(r.thumbnail)
                .setURL(r.url)
                .addFields(
                    { name: "💬┇Name", value: r.name, inline: true },
                    { name: "🎤┇Artist", value: r.artist, inline: true },
                    { name: "📁┇Album", value: r.album, inline: true },
                    { name: "🎼┇Length", value: r.length, inline: true },
                    { name: "🏷️┇Genre", value: r.genre, inline: true },
                    { name: "💵┇Price", value: r.price, inline: true },
                    { name: "⏰┇Release Date", value: `<t:${Math.round(new Date(r.release_date).getTime() / 1000)}>`, inline: true }
                )
                 .setFooter({ text: 'HackSaw I-Tunes API.', iconURL: interaction.client.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "Song not found!", ephemeral: true });
        }
    },
};

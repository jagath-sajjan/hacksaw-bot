const Discord = require('discord.js');
const weather = require('weather-js');

module.exports = {
    name: 'weather',
    description: 'Get weather information for a location',
    options: [
        {
            name: 'location',
            type: 3, // STRING type
            description: 'The location to get weather information for',
            required: true
        }
    ],
    async execute(interaction) {
        const country = interaction.options.getString('location');

        weather.find({ search: country, degreeType: 'C' }, function (error, result) {
            if (result === undefined || result.length === 0) return interaction.reply({
                content: "**Invalid** location",
                ephemeral: true
            });

            var current = result[0].current;
            var location = result[0].location;

            const embed = new Discord.EmbedBuilder()
                .setTitle(`☀️・Weather - ${current.skytext}`)
                .setDescription(`Weather forecast for ${current.observationpoint}`)
                .setThumbnail(current.imageUrl)
                .addFields(
                    { name: "Timezone", value: `UTC${location.timezone}`, inline: true },
                    { name: "Degree Type", value: `Celsius`, inline: true },
                    { name: "Temperature", value: `${current.temperature}°`, inline: true },
                    { name: "Wind", value: `${current.winddisplay}`, inline: true },
                    { name: "Feels like", value: `${current.feelslike}°`, inline: true },
                    { name: "Humidity", value: `${current.humidity}%`, inline: true }
                )
                 .setFooter({ text: 'HackSaw Weather API.', iconURL: interaction.client.user.displayAvatarURL() });

            interaction.reply({ embeds: [embed] });
        });
    }
};

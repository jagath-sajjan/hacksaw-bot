const { EmbedBuilder } = require('discord.js');
const { format, utcToZonedTime } = require('date-fns-tz');

module.exports = {
    name: 'time',
    description: 'Get the current time in any timezone',
    options: [
        {
            name: 'timezone',
            type: 3, // STRING
            description: 'The timezone to get the time for',
            required: true,
            choices: [
                { name: 'UTC', value: 'UTC' },
                { name: 'EST (Eastern Time)', value: 'America/New_York' },
                { name: 'PST (Pacific Time)', value: 'America/Los_Angeles' },
                { name: 'IST (Indian Standard Time)', value: 'Asia/Kolkata' },
                { name: 'JST (Japan Standard Time)', value: 'Asia/Tokyo' },
                { name: 'AEST (Australian Eastern Standard Time)', value: 'Australia/Sydney' },
                { name: 'GMT (Greenwich Mean Time)', value: 'Europe/London' },
                { name: 'CET (Central European Time)', value: 'Europe/Paris' },
            ]
        }
    ],
    async execute(interaction) {
        await interaction.deferReply();
        try {
            const timezone = interaction.options.getString('timezone');
            const now = new Date();
            const zonedTime = utcToZonedTime(now, timezone);
            const currentTime = format(zonedTime, 'MMMM dd, yyyy HH:mm:ss zzz', { timeZone: timezone });

            const embed = new EmbedBuilder()
                .setTitle(`Current Time in ${timezone}`)
                .setDescription(`The current time is: **${currentTime}**`)
                .setColor('Green')
                .setFooter({ text: 'HackSaw Time API', iconURL: interaction.client.user.displayAvatarURL() });

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Error in time command:', error);
            await interaction.editReply('An error occurred while fetching the time.');
        }
    },
};

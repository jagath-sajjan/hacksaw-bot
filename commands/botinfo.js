const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'botinfo',
    description: 'Show information about the bot',
    async execute(interaction) {
        try {
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Morse Bot Information')
                .setThumbnail('https://i.ibb.co/kQd588T/image.png')
                .addFields(
                    { name: 'Bot Name', value: 'Morse', inline: true },
                    { name: 'Language', value: 'Javascript', inline: true },
                    { name: 'Hosted On', value: 'Raspberry Pi 3 [Banglore/IN]', inline: true },
                    { name: 'Creator', value: '[GitHub](https://github.com/jagath-sajjan) | [YouTube](https://youtube.com/@nobooklad)', inline: false }
                )
                .setFooter({ text: 'HackSaw Bot Info API.', iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp(Date.now() + ms(timeAdded));

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('Invite')
                        .setStyle(ButtonStyle.Link)
                        .setURL('https://discord.com/oauth2/authorize?client_id=1270040432427925677&permissions=1758118824378192&integration_type=0&scope=applications.commands+bot'),
                    new ButtonBuilder()
                        .setLabel('Support')
                        .setStyle(ButtonStyle.Link)
                        .setURL('https://discord.gg/c4WEUgRDT4'),
                    new ButtonBuilder()
                        .setLabel('Buy Me Coffee')
                        .setStyle(ButtonStyle.Link)
                        .setURL('https://buymeacoffee.com/jagathsajjan')
                );

            await interaction.reply({ embeds: [embed], components: [row] });
        } catch (error) {
            console.error('Error in botinfo command:', error);
            await interaction.reply('An error occurred while fetching bot information.');
        }
    },
};

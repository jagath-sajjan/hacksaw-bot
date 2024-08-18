const axios = require('axios');
const generator = require('generate-password');

module.exports = {
    name: 'hack',
    description: 'Pretend to hack a user',
    options: [
        {
            name: 'user',
            type: 6, // USER type
            description: 'The user to hack',
            required: true
        }
    ],
    async execute(interaction) {
        const user = interaction.options.getUser('user');

        if (!user) {
            return interaction.reply({ content: "Please mention a user to hack!", ephemeral: true });
        }

        const password = generator.generate({
            length: 10,
            symbols: true,
            numbers: true
        });

        function wait(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        await interaction.reply({ content: `💻 Hacking ${user.username}...`, ephemeral: false });

        await wait(1000);
        await interaction.editReply({ content: `Searching for user information...` });

        await wait(1000);
        await interaction.editReply({ content: `Searching for IP address...` });

        await wait(1000);
        await interaction.editReply({ content: `The user's IP address was found!\n🔗 IP Address: \`127.0.0.1\`` });

        await wait(1000);
        await interaction.editReply({ content: `Searching for Discord login...` });

        await wait(1000);
        await interaction.editReply({ content: `The user's Discord login was found!\n📨 Email: \`${user.username}onDiscord@gmail.com\`\n🔑 Password: \`${password}\`` });

        await wait(1000);
        await interaction.editReply({ content: `Searching for Discord token...` });

        await wait(1000);
        try {
            const response = await axios.get(`https://some-random-api.com/bottoken?${user.id}`);
            const json = response.data;
            await interaction.editReply({ content: `The user's Discord account token was found!\n🔧 Token: \`${json.token}\`` });
        } catch (error) {
            await interaction.editReply({ content: `Failed to retrieve Discord token.` });
        }

        await wait(1000);
        await interaction.editReply({ content: `Reporting account to Discord for breaking TOS...` });

        await wait(1000);
        await interaction.editReply({ content: `${user.username} has been successfully hacked! All the user's information was sent to your DM.` });

        try {
            await interaction.user.send({
                embeds: [{
                    title: '😎 Pranked',
                    image: { url: "https://media1.tenor.com/images/05006ed09075a0d6965383797c3cea00/tenor.gif?itemid=17987788" }
                }]
            });
        } catch (error) {
            console.error('Failed to send DM:', error);
            await interaction.followUp({ content: "I couldn't send you a DM. Make sure you have DMs enabled for this server.", ephemeral: true });
        }
    }
};

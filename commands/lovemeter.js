module.exports = {
    name: 'lovemeter',
    description: 'Measure the love between two users',
    options: [
        {
            name: 'user1',
            description: 'The first user',
            type: 6,
            required: true
        },
        {
            name: 'user2',
            description: 'The second user',
            type: 6,
            required: true
        }
    ],
    async execute(interaction) {
        const user1 = interaction.options.getUser('user1');
        const user2 = interaction.options.getUser('user2');

        if (!user1 || !user2) {
            return interaction.reply({ content: "Please provide two valid users.", ephemeral: true });
        }

        if (user1.id === user2.id) {
            return interaction.reply({ content: "You cannot measure love between the same person!", ephemeral: true });
        }

        const result = Math.ceil(Math.random() * 100);

        const embed = {
            title: "❤️ Love Meter",
            description: "See how much you match!",
            fields: [
                {
                    name: "Name 1",
                    value: user1.toString(),
                    inline: true
                },
                {
                    name: "Name 2",
                    value: user2.toString(),
                    inline: true
                },
                {
                    name: "Result",
                    value: `${user1} and ${user2} match **${result}%**`,
                    inline: false
                }
            ],
            color: 0xFF69B4 // Pink color
        };

        await interaction.reply({ embeds: [embed] });
    }
};

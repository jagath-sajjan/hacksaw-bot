module.exports = {
    name: 'dino',
    description: 'Watch a dinosaur run through a cactus field!',
    async execute(interaction, args) {
        await interaction.deferReply();

        let msg = await interaction.editReply({ content: `---------------🦖`, fetchReply: true });
        let time = 1 * 1000;
        setTimeout(function () {
            interaction.editReply(`-----------🦖----`);
        }, time);
        time += 1.5 * 1000;

        setTimeout(function () {
            interaction.editReply(`----------🦖------`);
        }, time);
        time += 1.5 * 1000;

        setTimeout(function () {
            interaction.editReply(`--------🦖--------`);
        }, time);
        time += 1.5 * 1000;

        setTimeout(function () {
            interaction.editReply(`------🦖-----------`);
        }, time);
        time += 1.5 * 1000;

        setTimeout(function () {
            interaction.editReply(`-------🦖-----------`);
        }, time);
        time += 1.5 * 1000;

        setTimeout(function () {
            interaction.editReply(`---🌵-----🦖---------`);
        }, time);
        time += 1.5 * 1000;

        setTimeout(function () {
            interaction.editReply(`---🌵-🦖-------------`);
        }, time);
        time += 1.5 * 1000;

        setTimeout(function () {
            interaction.editReply(`🦖\n ---🌵--------------`);
        }, time);
        time += 1.5 * 1000;

        setTimeout(function () {
            interaction.editReply(`------🦖---🌵--------------`);
        }, time);
        time += 1.5 * 1000;

        setTimeout(function () {
            interaction.editReply(`----🦖-----🌵----------------`);
        }, time);
        time += 1.5 * 1000;

        setTimeout(function () {
            interaction.editReply(`-🌵🌵-----🦖-------🌵--------`);
        }, time);
        time += 1.5 * 1000;

        setTimeout(function () {
            interaction.editReply(`----🌵🌵-🦖----------🌵------`);
        }, time);
        time += 1.5 * 1000;

        setTimeout(function () {
            interaction.editReply(`🦖\n ---🌵🌵-------------🌵---`);
        }, time);
        time += 1.5 * 1000;

        setTimeout(function () {
            interaction.editReply(`-----🦖---🌵🌵-------------🌵--`);
        }, time);
        time += 1.5 * 1000;

        setTimeout(function () {
            interaction.editReply(`-------🦖-----🌵🌵-------------`);
        }, time);
        time += 1.5 * 1000;

        setTimeout(function () {
            interaction.editReply(`🎂----🦖--------🌵🌵-----------`);
        }, time);
        time += 1.5 * 1000;

        setTimeout(function () {
            interaction.editReply(`---🎂--🦖----------🌵🌵---------`);
        }, time);
        time += 1.5 * 1000;

        setTimeout(function () {
            interaction.editReply(`**Ⓜⓘⓢⓢⓘⓞⓝ Ⓒⓞⓜⓟⓛⓔⓣⓔⓓ !**\n ---🎂🦖----------🌵🌵-------------`);
        }, time);
    }
};

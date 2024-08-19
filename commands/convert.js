const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'convert',
    description: 'Convert between different units',
    options: [
        {
            name: 'value',
            type: 10, // ApplicationCommandOptionType.Number
            description: 'The value to convert',
            required: true
        },
        {
            name: 'from',
            type: 3, // ApplicationCommandOptionType.String
            description: 'The unit to convert from',
            required: true,
            choices: [
                { name: 'Meters', value: 'm' },
                { name: 'Kilometers', value: 'km' },
                { name: 'Centimeters', value: 'cm' },
                { name: 'Millimeters', value: 'mm' },
                { name: 'Inches', value: 'in' },
                { name: 'Feet', value: 'ft' },
                { name: 'Yards', value: 'yd' },
                { name: 'Miles', value: 'mi' },
                { name: 'Kilograms', value: 'kg' },
                { name: 'Grams', value: 'g' },
                { name: 'Milligrams', value: 'mg' },
                { name: 'Pounds', value: 'lb' },
                { name: 'Ounces', value: 'oz' },
                { name: 'Celsius', value: 'c' },
                { name: 'Fahrenheit', value: 'f' }
            ]
        },
        {
            name: 'to',
            type: 3, // ApplicationCommandOptionType.String
            description: 'The unit to convert to',
            required: true,
            choices: [
                { name: 'Meters', value: 'm' },
                { name: 'Kilometers', value: 'km' },
                { name: 'Centimeters', value: 'cm' },
                { name: 'Millimeters', value: 'mm' },
                { name: 'Inches', value: 'in' },
                { name: 'Feet', value: 'ft' },
                { name: 'Yards', value: 'yd' },
                { name: 'Miles', value: 'mi' },
                { name: 'Kilograms', value: 'kg' },
                { name: 'Grams', value: 'g' },
                { name: 'Milligrams', value: 'mg' },
                { name: 'Pounds', value: 'lb' },
                { name: 'Ounces', value: 'oz' },
                { name: 'Celsius', value: 'c' },
                { name: 'Fahrenheit', value: 'f' }
            ]
        }
    ],
    async execute(interaction) {
        const value = interaction.options.getNumber('value');
        const fromUnit = interaction.options.getString('from').toLowerCase();
        const toUnit = interaction.options.getString('to').toLowerCase();

        const result = convertUnit(value, fromUnit, toUnit);

        if (result !== null) {
            const embed = new EmbedBuilder()
                .setTitle('Unit Conversion')
                .setDescription(`${value} ${fromUnit} = ${result} ${toUnit}`)
                .setColor('Green')
                .setFooter({ text: 'HackSaw Convert API.', iconURL: interaction.client.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
        } else {
            await interaction.reply('Invalid unit conversion. Please check your units and try again.');
        }
    }
};

function convertUnit(value, fromUnit, toUnit) {
    const conversions = {
        // Length
        'm': 1,
        'km': 1000,
        'cm': 0.01,
        'mm': 0.001,
        'in': 0.0254,
        'ft': 0.3048,
        'yd': 0.9144,
        'mi': 1609.34,

        // Weight
        'kg': 1,
        'g': 0.001,
        'mg': 0.000001,
        'lb': 0.453592,
        'oz': 0.0283495,

        // Temperature conversions are handled separately
    };

    // Special case for temperature
    if ((fromUnit === 'c' && toUnit === 'f') || (fromUnit === 'f' && toUnit === 'c')) {
        if (fromUnit === 'c') {
            return ((value * 9/5) + 32).toFixed(2);
        } else {
            return ((value - 32) * 5/9).toFixed(2);
        }
    }

    if (conversions[fromUnit] && conversions[toUnit]) {
        return (value * conversions[fromUnit] / conversions[toUnit]).toFixed(4);
    }

    return null; // Invalid conversion
}

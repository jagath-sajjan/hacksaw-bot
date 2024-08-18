const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Read the word list from the file
const wordList = fs.readFileSync(path.join(__dirname, '..', 'words_alpha.txt'), 'utf-8')
    .split('\n')
    .map(word => word.trim().toLowerCase());

const anagramMap = new Map();

wordList.forEach(word => {
    const sortedWord = word.split('').sort().join('');
    if (!anagramMap.has(sortedWord)) {
        anagramMap.set(sortedWord, []);
    }
    anagramMap.get(sortedWord).push(word);
});

module.exports = {
    name: 'anagram',
    description: 'Find anagrams for a given word or phrase',
    options: [
        {
            name: 'input',
            type: 3, // STRING
            description: 'The word or phrase to find anagrams for',
            required: true
        }
    ],
    async execute(interaction) {
        await interaction.deferReply();
        try {
            const input = interaction.options.getString('input').toLowerCase().replace(/[^a-z]/g, '');
            const sortedInput = input.split('').sort().join('');
            const anagrams = anagramMap.get(sortedInput) || [];

            // Remove the original word from the anagram list
            const filteredAnagrams = anagrams.filter(word => word !== input);

            const embed = new EmbedBuilder()
                .setTitle(`Anagrams for "${interaction.options.getString('input')}"`)
                .setColor('Green')
                .setFooter({ text: 'Made By Jagath🩵' });

            if (filteredAnagrams.length > 0) {
                embed.setDescription(filteredAnagrams.slice(0, 20).join(', ') + (filteredAnagrams.length > 20 ? '...' : ''));
                embed.addFields({ name: 'Total Anagrams Found', value: filteredAnagrams.length.toString() });
            } else {
                embed.setDescription('No anagrams found.');
            }

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Error in anagram command:', error);
            await interaction.editReply('An error occurred while finding anagrams.');
        }
    },
};

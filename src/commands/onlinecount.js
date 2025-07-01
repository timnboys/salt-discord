const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'onlinecount',
    description: 'Get the number of players currently online on the server.',
    options: [],
    execute: async (interaction) => {
        const playerNumber = GetNumPlayerIndices();
        let message = "Nobody is online right now.";
        if (playerNumber === 1) message = "There is 1 person online right now.";
        else if (playerNumber > 1) message = `There are ${playerNumber} people online right now.`;

        const embed = new MessageEmbed()
            .setColor(0x00AE86)
            .setTitle('Online Player Count')
            .setDescription(message)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
}; 
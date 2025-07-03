const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'heal',
    description: 'Give an item to a player by SID.',
    options: [
        {
            name: 'sid',
            type: 3, // we convert string to number in lua
            description: 'Player SID or "all" for all players',
            required: true,
        },
    ],
    execute: async (interaction) => {
        const sid = interaction.options.getString('sid');
  
        const success = global.exports[GetCurrentResourceName()].heal(sid);

        // Use an embed for the reply
        const embed = new MessageEmbed()
            .setColor(success ? 0x00AE86 : 0xFF0000)
            .setTitle(success ? 'Healed Successfully' : 'Failed to Heal')
            .addFields(
                { name: 'SID', value: sid, inline: true },
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
}; 
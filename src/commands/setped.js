const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'setped',
    description: 'Set a player ped by SID.',
    options: [
        {
            name: 'sid',
            type: 3, // we convert string to number in lua
            description: 'Player SID',
            required: true,
        },
        {
            name: 'ped',
            type: 3,
            description: 'Ped Model (e.g. mp_m_freemode_01)',
            required: true,
        },
    ],
    execute: async (interaction) => {
        const sid = interaction.options.getString('sid');
        const ped = interaction.options.getString('ped');
  
        const success = global.exports[GetCurrentResourceName()].setPed(sid, ped);

        // Use an embed for the reply
        const embed = new MessageEmbed()
            .setColor(success ? 0x00AE86 : 0xFF0000)
            .setTitle(success ? 'Set Ped Successfully' : 'Failed to Set Ped (Player probably offline)')
            .addFields(
                { name: 'Ped', value: ped, inline: true },
                { name: 'SID', value: sid, inline: true },
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
}; 
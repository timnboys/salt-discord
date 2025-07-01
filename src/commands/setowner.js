const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'setowner',
    description: 'Set a job\'s owner by SID.',
    options: [
        {
            name: 'sid',
            type: 3, // we convert string to number in lua
            description: 'Player SID',
            required: true,
        },
        {
            name: 'job',
            type: 3,
            description: 'Job (e.g. police)',
            required: true,
        },
    ],
    execute: async (interaction) => {
        const sid = interaction.options.getString('sid');
        const job = interaction.options.getString('job');
  
        const success = global.exports[GetCurrentResourceName()].setOwner(sid, job);

        // Use an embed for the reply
        const embed = new MessageEmbed()
            .setColor(success ? 0x00AE86 : 0xFF0000)
            .setTitle(success ? 'Set Job Owner Successfully' : 'Failed to Set Job Owner')
            .addFields(
                { name: 'Job', value: job, inline: true },
                { name: 'SID', value: sid, inline: true },
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
}; 
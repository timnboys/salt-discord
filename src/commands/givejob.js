const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'givejob',
    description: 'Give a job to a player by SID.',
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
        {
            name: 'grade',
            type: 3,
            description: 'Grade (e.g. chief)',
            required: true,
        },
        {
            name: 'workplace',
            type: 3,
            description: 'Workplace (e.g lspd)',
            required: false,
        },
    ],
    execute: async (interaction) => {
        const sid = interaction.options.getString('sid');
        const job = interaction.options.getString('job');
        const grade = interaction.options.getString('grade');
        const workplace = interaction.options.getString('workplace');
  
        const success = global.exports[GetCurrentResourceName()].giveJob(sid, job, grade, workplace);

        // Use an embed for the reply
        const embed = new MessageEmbed()
            .setColor(success ? 0x00AE86 : 0xFF0000)
            .setTitle(success ? 'Job Added Successfully' : 'Failed to Add Job')
            .addFields(
                { name: 'Job', value: job, inline: true },
                { name: 'Grade', value: grade, inline: true },
                { name: 'Workplace', value: workplace || 'N/A', inline: true },
                { name: 'SID', value: sid, inline: true },
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
}; 
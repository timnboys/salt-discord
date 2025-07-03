const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'nuke',
    description: 'DO NOT USE THIS!',
    execute: async (interaction) => {
        const embed = new MessageEmbed()
            .setColor(0xFF0000)
            .setTitle('💥 NUCLEAR LAUNCH DENIED 💥')
            .setDescription(`A nuclear strike has been denied by <@${interaction.user.id}>! No Allowed Usage of this command!`)
            .addFields({ name: 'Denied', value: 'DO NOT USE!', inline: true })
            .setTimestamp();

        const sentMessage = await interaction.reply({ embeds: [embed], fetchReply: true });
    },
}; 

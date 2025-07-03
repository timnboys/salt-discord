const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'nuke',
    description: 'Unleash the nuke on the server like it\'s Hiroshima.',
    execute: async (interaction) => { 
        emitNet("Admin:Client:NukeCountdown", -1);

        const embed = new MessageEmbed()
            .setColor(0xFF0000)
            .setTitle('💥 NUCLEAR LAUNCH INITIATED 💥')
            .setDescription(`A nuclear strike has been launched by <@${interaction.user.id}>! Take cover!`)
            .addFields({ name: 'Detonation In', value: '23 seconds', inline: true })
            .setTimestamp();

        const sentMessage = await interaction.reply({ embeds: [embed], fetchReply: true });

        const updateEmbed = (seconds) => {
            return new MessageEmbed()
                .setColor(0xFF0000)
                .setTitle('💥 NUCLEAR LAUNCH INITIATED 💥')
                .setDescription(`A nuclear strike has been launched by <@${interaction.user.id}>! Take cover!`)
                .addFields({ name: 'Detonation In', value: `${seconds} seconds`, inline: true })
                .setTimestamp();
        };

        setTimeout(() => sentMessage.edit({ embeds: [updateEmbed(20)] }), 3000);
        setTimeout(() => sentMessage.edit({ embeds: [updateEmbed(10)] }), 13000);
        setTimeout(() => sentMessage.edit({ embeds: [updateEmbed(5)] }), 18000);
        setTimeout(() => sentMessage.edit({ embeds: [updateEmbed(3)] }), 20000);
        setTimeout(() => sentMessage.edit({ embeds: [updateEmbed(2)] }), 21000);
        setTimeout(() => sentMessage.edit({ embeds: [updateEmbed(1)] }), 22000);

        setTimeout(() => {
            const detonateEmbed = new MessageEmbed()
                .setColor(0x000000)
                .setTitle('☢️ NUCLEAR DETONATION ☢️')
                .setDescription('The nuke has detonated. The server is in ruins.')
                .setTimestamp();
            sentMessage.edit({ embeds: [detonateEmbed] });
        }, 23000);

        setTimeout(() => {
            emitNet("Admin:Client:Nuke", -1);
        }, 23000);
    },
}; 
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'addcrypto',
    description: 'Give cryptocurrency to a character',
    options: [
        {
            name: 'sid',
            type: 3, // we convert string to number in lua
            description: 'SID of the player',
            required: true,
        },
        {
            name: 'crypto',
            type: 3, // string
            description: 'Type of cryptocurrency to give (VRM, PLEB or HEIST)',
            required: true,
            choices: [
                { name: 'VRM', value: 'VRM' },
                { name: 'PLEB', value: 'PLEB' },
                { name: 'HEIST', value: 'HEIST' },
            ],
        },
        {
            name: 'amount',
            type: 4,
            description: 'Amount of cryptocurrency to give',
            required: true,
        },
    ],
    execute: async (interaction) => {
        const sid = interaction.options.getString('sid');
        const crypto = interaction.options.getString('crypto');
        const amount = interaction.options.getInteger('amount');

        const success = global.exports[GetCurrentResourceName()].addCrypto(sid, crypto, amount);

        // Use an embed for the reply
        const embed = new MessageEmbed()
            .setColor(success ? 0x00AE86 : 0xFF0000)
            .setTitle(success ? `Successfully added $${amount} to ${crypto} for SID: ${sid}` : `Failed to add $${amount} to ${crypto} for SID: ${sid} (Player is probably offline)`)
            .addFields(
                { name: 'Crypto', value: crypto, inline: true },
                { name: 'Amount', value: amount.toString(), inline: true },
                { name: 'SID', value: sid, inline: true },
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
}; 
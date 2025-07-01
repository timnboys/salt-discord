const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'givemoney',
    description: 'Give money to a player by SID.',
    options: [
        {
            name: 'sid',
            type: 3, // we convert string to number in lua
            description: 'Player SID',
            required: true,
        },
        {
            name: 'type',
            type: 3, // string
            description: 'Where to give the money: bank or cash',
            required: true,
            choices: [
                { name: 'Bank', value: 'bank' },
                { name: 'Cash', value: 'cash' },
            ],
        },
        {
            name: 'amount',
            type: 4,
            description: 'Amount of the item',
            required: true,
        },
    ],
    execute: async (interaction) => {
        const sid = interaction.options.getString('sid');
        const _type = interaction.options.getString('type');
        const amount = interaction.options.getInteger('amount');

        const success = global.exports[GetCurrentResourceName()].giveMoney(sid, _type, amount);

        // Use an embed for the reply
        const embed = new MessageEmbed()
            .setColor(success ? 0x00AE86 : 0xFF0000)
            .setTitle(success ? `Successfully added $${amount} to ${_type} for SID: ${sid}` : `Failed to add $${amount} to ${_type} for SID: ${sid} (Player is probably offline)`)
            .addFields(
                { name: 'Type', value: _type, inline: true },
                { name: 'Amount', value: amount.toString(), inline: true },
                { name: 'SID', value: sid, inline: true },
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
}; 
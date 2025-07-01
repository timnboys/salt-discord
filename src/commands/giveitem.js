const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'giveitem',
    description: 'Give an item to a player by SID.',
    options: [
        {
            name: 'sid',
            type: 3, // we convert string to number in lua
            description: 'Player SID',
            required: true,
        },
        {
            name: 'item',
            type: 3,
            description: 'Item name',
            required: true,
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
        const item = interaction.options.getString('item');
        const amount = interaction.options.getInteger('amount');

  
        const success = global.exports[GetCurrentResourceName()].giveItem(sid, item, amount);

        // Use an embed for the reply
        const embed = new MessageEmbed()
            .setColor(success ? 0x00AE86 : 0xFF0000)
            .setTitle(success ? 'Item Added Successfully' : 'Failed to Add Item (Player may be offline or item might not exist)')
            .addFields(
                { name: 'Item', value: item, inline: true },
                { name: 'Amount', value: amount.toString(), inline: true },
                { name: 'SID', value: sid, inline: true },
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
}; 
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'giveweapon',
    description: 'Give a weapon to a player by SID.',
    options: [
        {
            name: 'sid',
            type: 3, // we convert string to number in lua
            description: 'Player SID',
            required: true,
        },
        {
            name: 'weapon',
            type: 3,
            description: 'Weapon name',
            required: true,
        },
        {
            name: 'ammo',
            type: 4,
            description: 'The amount of ammo with the weapon.',
            required: true,
        },
        {
            name: 'scractched',
            type: 3, // string
            description: 'Where to give the money: bank or cash',
            required: true,
            choices: [
                { name: 'True', value: '1' },
                { name: 'False', value: '0' },
            ],
        },
    ],
    execute: async (interaction) => {
        const sid = interaction.options.getString('sid');
        const weapon = interaction.options.getString('weapon');
        const ammo = interaction.options.getInteger('ammo');
        const scractched = interaction.options.getString('scractched');

  
        const success = global.exports[GetCurrentResourceName()].giveWeapon(sid, weapon, ammo, scractched);

        // Use an embed for the reply
        const embed = new MessageEmbed()
            .setColor(success ? 0x00AE86 : 0xFF0000)
            .setTitle(success ? 'Item Weapon Successfully' : 'Failed to Add Weapon (Player may be offline or weapon might not exist)')
            .addFields(
                { name: 'Weapon', value: weapon, inline: true },
                { name: 'Ammo', value: ammo.toString(), inline: true },
                { name: 'Scratched', value: scractched, inline: true },
                { name: 'SID', value: sid, inline: true },
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
}; 
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'addownedvehicle',
    description: 'Add Owned Vehicle to Player.',
    options: [
        {
            name: 'sid',
            type: 3, // we convert string to number in lua
            description: 'State ID of Target Character',
            required: true,
        },
        {
            name: 'hash',
            type: 3,
            description: 'Vehicle Model (Spawn Code)',
            required: true,
        },
        {
            name: 'make',
            type: 3,
            description: 'Make of Vehicle e.g Dodge',
            required: true,
        },
        {
            name: 'model',
            type: 3,
            description: 'Model Name of Vehicle e.g Charger',
            required: true,
        },
        {
            name: 'class',
            type: 3,
            description: 'Class of Vehicle e.g S, A+, A, B',
            required: true,
        },
        {
            name: 'value',
            type: 4,
            description: 'Monetary Value of Vehicle e.g 50000',
            required: true,
        },
        // {
        //     name: 'type',
        //     type: 4,
        //     description: 'Vehicle/Car = 0; Boats = 1; Aircraft = 2;',
        //     required: true,
        // },
        {
            name: 'type',
            type: 4, // string
            description: 'Vehicle Type',
            required: true,
            choices: [
                { name: 'Car', value: 0 },
                { name: 'Boats', value: 1 },
                { name: 'Aircraft', value: 2 },
            ],
        },
    ],
    execute: async (interaction) => {
        const sid = interaction.options.getString('sid');
        const hash = interaction.options.getString('hash');
        const make = interaction.options.getString('make');
        const model = interaction.options.getString('model');
        const _class = interaction.options.getString('class');
        const value = interaction.options.getInteger('value');
        const _type = interaction.options.getInteger('type');
  
        const success = await global.exports[GetCurrentResourceName()].addOwnedVehicle(sid, hash, make, model, _class, value, _type);
        let embed;
        if (success) {
            embed = new MessageEmbed()
                .setColor(0x00AE86)
                .setTitle('Vehicle Added Successfully')
                .addFields(
                    { name: 'SID', value: sid, inline: true },
                    { name: 'VIN', value: success, inline: true },
                    { name: 'Model', value: model, inline: true },
                    { name: 'Make', value: make, inline: true },
                    { name: 'Class', value: _class, inline: true },
                    { name: 'Type', value: _type.toString(), inline: true },
                    { name: 'Value', value: value.toString(), inline: true },
                    { name: 'Hash', value: hash, inline: true }
                )
                .setTimestamp();
        } else {
            embed = new MessageEmbed()
                .setColor(0xFF0000)
                .setTitle('Failed to Add Vehicle')
                .setDescription('Player may be offline or vehicle could not be added.')
                .addFields(
                    { name: 'SID', value: sid, inline: true },
                    { name: 'Model', value: model, inline: true },
                    { name: 'Make', value: make, inline: true },
                    { name: 'Class', value: _class, inline: true },
                    { name: 'Type', value: _type.toString(), inline: true },
                    { name: 'Value', value: value.toString(), inline: true },
                    { name: 'Hash', value: hash, inline: true }
                )
                .setTimestamp();
        }

        await interaction.reply({ embeds: [embed] });
    },
}; 
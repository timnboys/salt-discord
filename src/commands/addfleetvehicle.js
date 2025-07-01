const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'addfleetvehicle',
    description: 'Add a Fleet Vehicle to a Job',
    options: [
        {
            name: 'job',
            type: 3, // we convert string to number in lua
            description: 'State ID of Target Character',
            required: true,
        },
        {
            name: 'workplace',
            type: 3,
            description: 'ID of Workplace. Put "false" or "all" for All Workplaces to Access the Fleet Vehicle',
            required: true,
        },
        {
            name: 'level',
            type: 4,
            description: 'Required Level',
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
        {
            name: 'type',
            type: 4,
            description: 'Vehicle Type',
            required: true,
            choices: [
                { name: 'Car', value: 0 },
                { name: 'Boats', value: 1 },
                { name: 'Aircraft', value: 2 },
            ],
        },
        {
            name: 'qual',
            type: 3,
            description: 'Job Qualification Put "false" or "all" for All to Access the Fleet Vehicle',
            required: true,
        },
    ],
    execute: async (interaction) => {
        const job = interaction.options.getString('job');
        const workplace = interaction.options.getString('workplace');
        const level = interaction.options.getInteger('level');
        const hash = interaction.options.getString('hash');
        const make = interaction.options.getString('make');
        const model = interaction.options.getString('model');
        const _class = interaction.options.getString('class');
        const value = interaction.options.getInteger('value');
        const _type = interaction.options.getInteger('type');
        const qual = interaction.options.getString('qual');
  
        const success = await global.exports[GetCurrentResourceName()].addFleetVehicle(job, workplace, level, hash, make, model, _class, value, _type, qual);
        let embed;
        if (success) {
            embed = new MessageEmbed()
                .setColor(0x00AE86)
                .setTitle('Vehicle Added Successfully')
                .addFields(
                    { name: 'Job', value: job, inline: true },
                    { name: 'Workplace', value: workplace, inline: true },
                    { name: 'Level', value: level.toString(), inline: true },
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
                    { name: 'Job', value: job, inline: true },
                    { name: 'Workplace', value: workplace, inline: true },
                    { name: 'Level', value: level.toString(), inline: true },
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
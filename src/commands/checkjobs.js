const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'checkjobs',
    description: 'Shows the Jobs a Character Has.',
    options: [
        {
            name: 'sid',
            type: 3, // we convert string to number in lua
            description: 'Player SID',
            required: true,
        },
    ],
    execute: async (interaction) => {
        const sid = interaction.options.getString('sid');
  
        const jobs = await global.exports[GetCurrentResourceName()].fetchJobs(sid);
        // console.log(jobs);

        if (!jobs) {
            const embed = new MessageEmbed()
                .setColor(0xFF0000)
                .setTitle('Error')
                .setDescription(`Failed to fetch jobs for SID: ${sid}`)
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed] });
            return;
        }

        // Convert jobs object to array if it's not already
        const characterJobs = Array.isArray(jobs) ? jobs : Object.values(jobs);
        
        if (!characterJobs || characterJobs.length === 0) {
            const embed = new MessageEmbed()
                .setColor(0xFFA500) // Orange for no jobs
                .setTitle(`Character Jobs (SID: ${sid})`)
                // .setDescription(`SID: ${sid}`)
                .addFields(
                    { name: 'Jobs', value: 'This character has no jobs.', inline: false }
                )
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed] });
            return;
        }

        // Create paginated display for jobs
        const jobsPerPage = 3;
        const totalPages = Math.ceil(characterJobs.length / jobsPerPage);
        let currentPage = 0;

        function createJobEmbed(page) {
            const startIndex = page * jobsPerPage;
            const endIndex = Math.min(startIndex + jobsPerPage, characterJobs.length);
            const pageJobs = characterJobs.slice(startIndex, endIndex);

            const embed = new MessageEmbed()
                .setColor(0x00AE86)
                .setTitle(`Character Jobs (SID: ${sid})`)
                // .setDescription(`SID: ${sid}`)
                .setFooter({ text: `Page ${page + 1} of ${totalPages}` })
                .setTimestamp();

            let description = '';
            
            for (const job of pageJobs) {
                const jobName = job.Name || 'Unknown Job';
                const jobId = job.Id || 'Unknown';
                const jobGrade = job.Grade || {};
                const jobWorkplace = job.Workplace;
                
                description += `**${jobName}** (ID: \`${jobId}\`)\n`;
                
                // Handle grade information
                if (jobGrade && jobGrade.Name) {
                    description += `📋 Grade: ${jobGrade.Name} (ID: \`${jobGrade.Id || 'N/A'}\` | Level: ${jobGrade.Level || 0})\n`;
                } else {
                    description += `📋 Grade: Unknown\n`;
                }
                
                // Handle workplace information
                if (jobWorkplace && jobWorkplace !== false) {
                    if (typeof jobWorkplace === 'object' && jobWorkplace.Name) {
                        description += `🏢 Workplace: ${jobWorkplace.Name} (ID: \`${jobWorkplace.Id || 'N/A'}\`)\n`;
                    } else {
                        description += `🏢 Workplace: ${jobWorkplace}\n`;
                    }
                } else {
                    description += `🏢 Workplace: None\n`;
                }
                
                description += '\n';
            }

            embed.addFields({ name: 'Jobs', value: description.trim(), inline: false });
            return embed;
        }

        // Create navigation buttons if multiple pages
        if (totalPages > 1) {
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('first')
                        .setLabel('⏮️ First')
                        .setStyle('SECONDARY')
                        .setDisabled(currentPage === 0),
                    new MessageButton()
                        .setCustomId('prev')
                        .setLabel('◀️ Previous')
                        .setStyle('PRIMARY')
                        .setDisabled(currentPage === 0),
                    new MessageButton()
                        .setCustomId('next')
                        .setLabel('Next ▶️')
                        .setStyle('PRIMARY')
                        .setDisabled(currentPage === totalPages - 1),
                    new MessageButton()
                        .setCustomId('last')
                        .setLabel('Last ⏭️')
                        .setStyle('SECONDARY')
                        .setDisabled(currentPage === totalPages - 1)
                );

            const initialEmbed = createJobEmbed(currentPage);
            const reply = await interaction.reply({ 
                embeds: [initialEmbed], 
                components: [row],
                fetchReply: true 
            });

            const collector = reply.createMessageComponentCollector({ 
                time: 300000 // 5 minutes
            });

            collector.on('collect', async (i) => {
                if (i.user.id !== interaction.user.id) {
                    await i.reply({ content: 'You can only use these buttons!', ephemeral: true });
                    return;
                }

                switch (i.customId) {
                    case 'first':
                        currentPage = 0;
                        break;
                    case 'prev':
                        currentPage = Math.max(0, currentPage - 1);
                        break;
                    case 'next':
                        currentPage = Math.min(totalPages - 1, currentPage + 1);
                        break;
                    case 'last':
                        currentPage = totalPages - 1;
                        break;
                }

                const newEmbed = createJobEmbed(currentPage);
                const newRow = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('first')
                            .setLabel('⏮️ First')
                            .setStyle('SECONDARY')
                            .setDisabled(currentPage === 0),
                        new MessageButton()
                            .setCustomId('prev')
                            .setLabel('◀️ Previous')
                            .setStyle('PRIMARY')
                            .setDisabled(currentPage === 0),
                        new MessageButton()
                            .setCustomId('next')
                            .setLabel('Next ▶️')
                            .setStyle('PRIMARY')
                            .setDisabled(currentPage === totalPages - 1),
                        new MessageButton()
                            .setCustomId('last')
                            .setLabel('Last ⏭️')
                            .setStyle('SECONDARY')
                            .setDisabled(currentPage === totalPages - 1)
                    );

                await i.update({ embeds: [newEmbed], components: [newRow] });
            });

            collector.on('end', async () => {
                const disabledRow = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('first')
                            .setLabel('⏮️ First')
                            .setStyle('SECONDARY')
                            .setDisabled(true),
                        new MessageButton()
                            .setCustomId('prev')
                            .setLabel('◀️ Previous')
                            .setStyle('PRIMARY')
                            .setDisabled(true),
                        new MessageButton()
                            .setCustomId('next')
                            .setLabel('Next ▶️')
                            .setStyle('PRIMARY')
                            .setDisabled(true),
                        new MessageButton()
                            .setCustomId('last')
                            .setLabel('Last ⏭️')
                            .setStyle('SECONDARY')
                            .setDisabled(true)
                    );

                await reply.edit({ components: [disabledRow] }).catch(() => {});
            });
        } else {
            // Single page - no navigation needed
            const embed = createJobEmbed(currentPage);
            await interaction.reply({ embeds: [embed] });
        }
    },
}; 
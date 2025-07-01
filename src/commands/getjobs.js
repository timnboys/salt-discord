const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'getjobs',
    description: 'Gets a list of all jobs currently on the server.',
    execute: async (interaction) => {
        const jobs = global.exports[GetCurrentResourceName()].getJobs();

        if (!jobs || Object.keys(jobs).length === 0) {
            const embed = new MessageEmbed()
                .setColor(0x0099FF)
                .setTitle('Server Jobs')
                .setDescription('There are no jobs currently.')
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed] });
            return;
        }

        const jobsArray = Object.values(jobs);
        const jobsPerPage = 3; // Show 3 jobs per page
        const totalPages = Math.ceil(jobsArray.length / jobsPerPage);
        let currentPage = 0;

        function createJobEmbed(page) {
            const startIndex = page * jobsPerPage;
            const endIndex = Math.min(startIndex + jobsPerPage, jobsArray.length);
            const pageJobs = jobsArray.slice(startIndex, endIndex);

            const embed = new MessageEmbed()
                .setColor(0x0099FF)
                .setTitle(`Server Jobs (${jobsArray.length} total)`)
                .setFooter({ text: `Page ${page + 1} of ${totalPages}` })
                .setTimestamp();

            let description = '';
            
            for (const job of pageJobs) {
                const jobName = job.Name || job.name || job.Id;
                const jobSalary = job.Salary || 0;
                const jobType = job.Type || 'Unknown';
                
                description += `**${jobName}** (ID: \`${job.Id}\`)\n`;
                description += `💰 Salary: $${jobSalary} | 📊 Type: ${jobType}\n`;
                
                // Handle jobs with workplaces (like prison)
                if (job.Workplaces && job.Workplaces.length > 0) {
                    description += `🏢 Workplaces:\n`;
                    for (const workplace of job.Workplaces) {
                        description += `  **${workplace.Name}** (ID: \`${workplace.Id}\`)\n`;
                        if (workplace.Grades && workplace.Grades.length > 0) {
                            description += `    📋 Grades:\n`;
                            for (const grade of workplace.Grades) {
                                const gradeName = grade.Name || 'Unknown';
                                const gradeId = grade.Id || 'N/A';
                                const gradeLevel = grade.Level || 0;
                                description += `      • ${gradeName} (ID: \`${gradeId}\` | Level: ${gradeLevel})\n`;
                            }
                        } else {
                            description += `    📋 Grades: None\n`;
                        }
                    }
                }
                // Handle simple jobs (like casino)
                else if (job.Grades && job.Grades.length > 0) {
                    description += `📋 Grades:\n`;
                    for (const grade of job.Grades) {
                        const gradeName = grade.Name || 'Unknown';
                        const gradeId = grade.Id || 'N/A';
                        const gradeLevel = grade.Level || 0;
                        description += `  • ${gradeName} (ID: \`${gradeId}\` | Level: ${gradeLevel})\n`;
                    }
                } else {
                    description += `📋 Grades: None\n`;
                }
                description += '\n';
            }

            embed.setDescription(description.trim());
            return embed;
        }

        // Create navigation buttons
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
            components: totalPages > 1 ? [row] : [],
            fetchReply: true 
        });

        // Only add collector if there are multiple pages
        if (totalPages <= 1) return;

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
    },
}; 
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'players',
    description: 'Gets a list of all players currently on the server.',
    execute: async (interaction) => {    
        const playerSources = getPlayers();

        if (playerSources.length === 0) {
            const embed = new MessageEmbed()
                .setColor(0xFFA500) // Orange for no players
                .setTitle('Server Players')
                .setDescription('There are no players currently online.')
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed] });
            return;
        }

        // Create paginated display for players
        const playersPerPage = 25; // Show 25 players per page
        const totalPages = Math.ceil(playerSources.length / playersPerPage);
        let currentPage = 0;

        function createPlayerEmbed(page) {
            const startIndex = page * playersPerPage;
            const endIndex = Math.min(startIndex + playersPerPage, playerSources.length);
            const pagePlayers = playerSources.slice(startIndex, endIndex);

            const embed = new MessageEmbed()
                .setColor(0x0099FF)
                .setTitle(`Server Players (${playerSources.length} total)`)
                .setFooter({ text: `Page ${page + 1} of ${totalPages}` })
                .setTimestamp();

            let description = '';
            let loadedPlayers = 0;
            let loadingPlayers = 0;
            
            for (const source of pagePlayers) {
                const char = global.exports[GetCurrentResourceName()].fetchSource(source);
                const playerName = GetPlayerName(source);
                
                if (char) {
                    loadedPlayers++;
                    const fullName = `${char.First} ${char.Last}`;
                    const sid = char.SID || 'N/A';
                    
                    description += `**${fullName}** (${playerName})\n`;
                    description += `ID: \`${source}\` | SID: \`${sid}\`\n`;
                    
                    // Add character details if available
                    if (char.Phone) {
                        description += `    Phone: \`${char.Phone}\`\n`;
                    }
                    
                    description += '\n';
                } else {
                    loadingPlayers++;
                    description += `**${playerName}**\n`;
                    description += `ID: \`${source}\` | Status: *Loading In*\n\n`;
                }
            }

            // Add summary at the top
            const summary = `📊 **Summary:** ${loadedPlayers} loaded, ${loadingPlayers} loading\n\n`;
            embed.setDescription(summary + description.trim());
            
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

            const initialEmbed = createPlayerEmbed(currentPage);
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

                const newEmbed = createPlayerEmbed(currentPage);
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
            const embed = createPlayerEmbed(currentPage);
            await interaction.reply({ embeds: [embed] });
        }
    },
}; 
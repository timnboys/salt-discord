module.exports = {
    name: 'ping',
    description: 'Replies with Pong!',
    execute: async (interaction) => {
        // await interaction.reply('Pong!');
        const start = Date.now();
        await interaction.reply('Pinging...');
        const end = Date.now();
    
        const latency = end - start;
        await interaction.editReply(`Pong! 🏓 Latency is ${latency}ms`);
    },
}; 
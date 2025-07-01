const fs = require('fs');
const path = require('path');
const { Client, Intents, Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const token = GetConvar('salt_discord_token', '');
const clientId = GetConvar('salt_discord_client_id', '');

if (!token || token === '' || !clientId || clientId === '') {
    console.error('^1[salt-discord] Discord token or client ID not found. Please set salt_discord_token and salt_discord_client_id in your server.cfg^0');
} else {
    const client = new Client({
        intents: [Intents.FLAGS.GUILDS],
    });

    client.commands = new Collection();
    const commandsToRegister = [];

    const commandsPath = path.join(GetResourcePath(GetCurrentResourceName()), 'src', 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('name' in command && 'description' in command) {
            client.commands.set(command.name, command);
            commandsToRegister.push({ name: command.name, description: command.description, options: command.options || [] });
        } else {
            console.log(`^3[salt-discord] The command at ${filePath} is missing a required "name" or "description" property.^0`);
        }
    }

    const rest = new REST({ version: '9' }).setToken(token);

    (async () => {
        try {
            console.log(`^2[salt-discord] Started refreshing ${commandsToRegister.length} application (/) commands.^0`);
            await rest.put(
                Routes.applicationCommands(clientId),
                { body: commandsToRegister },
            );
            console.log(`^2[salt-discord] Successfully reloaded ${commandsToRegister.length} application (/) commands.^0`);
        } catch (error) {
            console.error(error);
        }
    })();

    client.once('ready', () => {
        console.log(`^2[salt-discord] Logged in as ${client.user.tag}!^0`);
    });

    client.on('interactionCreate', (interaction) => {
        setImmediate(async () => {
            if (!interaction.isCommand()) return;

            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`^1[salt-discord] No command matching ${interaction.commandName} was found.^0`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        });
    });

    client.login(token).catch((e) => {
        console.error(`^1[salt-discord] Failed to log in: ${e.message}^0`);
    });
}

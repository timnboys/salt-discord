const { SlashCommandBuilder } = require('@discordjs/builders');

const MySQL = global.exports.oxmysql;

module.exports = {
    name: 'permissions',
    description: 'Manage bot permissions (admin/mod roles, command permissions)',
    options: [
        {
            name: 'action',
            type: 3,
            description: 'Action to perform',
            required: true,
            choices: [
                { name: 'add_admin_role', value: 'add_admin_role' },
                { name: 'remove_admin_role', value: 'remove_admin_role' },
                { name: 'add_mod_role', value: 'add_mod_role' },
                { name: 'remove_mod_role', value: 'remove_mod_role' },
                { name: 'set_command_permission', value: 'set_command_permission' },
                { name: 'add_ignored_command', value: 'add_ignored_command' },
                { name: 'remove_ignored_command', value: 'remove_ignored_command' },
                { name: 'list', value: 'list' },
            ],
        },
        {
            name: 'role',
            type: 8, // ROLE
            description: 'Discord role (for admin/mod actions)',
            required: false,
        },
        {
            name: 'command',
            type: 3,
            description: 'Command name (for command permission)',
            required: false,
        },
        {
            name: 'roles',
            type: 3,
            description: 'Which staff roles can use this command (admin, mod, both, none)',
            required: false,
            choices: [
                { name: 'admin', value: 'admin' },
                { name: 'mod', value: 'mod' },
                { name: 'both', value: 'both' },
                { name: 'none', value: 'none' },
            ],
        },
    ],
    async execute(interaction) {
        const OWNER_ROLE_ID = GetConvar('salt_discord_owner_role_id', '1368391612274704444');
        const member = interaction.member;
        if (!member.roles.cache.has(OWNER_ROLE_ID)) {
            await interaction.reply({ content: 'Only the owner role can manage permissions.', ephemeral: true });
            return;
        }
        const action = interaction.options.getString('action');
        const role = interaction.options.getRole('role');
        const command = interaction.options.getString('command');
        const rolesChoice = interaction.options.getString('roles');
        let msg = '';
        switch (action) {
            case 'add_admin_role':
                if (!role) { msg = 'No role specified.'; break; }
                MySQL.execute('INSERT INTO discord_permissions (type, value) VALUES (?, ?)', ['admin_role', role.id], (affectedRows) => {
                    msg = `Added <@&${role.id}> as an admin role.`;
                    interaction.reply({ content: msg, ephemeral: true });
                });
                return;
            case 'remove_admin_role':
                if (!role) { msg = 'No role specified.'; break; }
                MySQL.execute('DELETE FROM discord_permissions WHERE type = ? AND value = ?', ['admin_role', role.id], (affectedRows) => {
                    msg = `Removed <@&${role.id}> from admin roles.`;
                    interaction.reply({ content: msg, ephemeral: true });
                });
                return;
            case 'add_mod_role':
                if (!role) { msg = 'No role specified.'; break; }
                MySQL.execute('INSERT INTO discord_permissions (type, value) VALUES (?, ?)', ['mod_role', role.id], (affectedRows) => {
                    msg = `Added <@&${role.id}> as a mod role.`;
                    interaction.reply({ content: msg, ephemeral: true });
                });
                return;
            case 'remove_mod_role':
                if (!role) { msg = 'No role specified.'; break; }
                MySQL.execute('DELETE FROM discord_permissions WHERE type = ? AND value = ?', ['mod_role', role.id], (affectedRows) => {
                    msg = `Removed <@&${role.id}> from mod roles.`;
                    interaction.reply({ content: msg, ephemeral: true });
                });
                return;
            case 'set_command_permission':
                if (!command || !rolesChoice) { msg = 'Command or roles not specified.'; break; }
                // Remove old permissions first
                MySQL.execute('DELETE FROM discord_permissions WHERE type = ? AND value = ?', ['command_permission', command], (affectedRows) => {
                    let roles = [];
                    if (rolesChoice === 'both') roles = ['admin', 'mod'];
                    else if (rolesChoice === 'none') roles = [];
                    else roles = [rolesChoice];
                    if (!roles.length) {
                        msg = `Removed all permissions for command \\"${command}\\".`;
                        interaction.reply({ content: msg, ephemeral: true });
                        return;
                    }
                    let completed = 0;
                    roles.forEach(roleType => {
                        MySQL.execute('INSERT INTO discord_permissions (type, value, extra) VALUES (?, ?, ?)', ['command_permission', command, roleType], () => {
                            completed++;
                            if (completed === roles.length) {
                                msg = `Set command \\"${command}\\" to be usable by: ${roles.join(', ')}`;
                                interaction.reply({ content: msg, ephemeral: true });
                            }
                        });
                    });
                });
                return;
            case 'add_ignored_command':
                if (!command) { msg = 'No command specified.'; break; }
                MySQL.execute('INSERT INTO discord_permissions (type, value) VALUES (?, ?)', ['ignored_command', command], (affectedRows) => {
                    msg = `Added \`${command}\` to ignored commands.`;
                    interaction.reply({ content: msg, ephemeral: true });
                });
                return;
            case 'remove_ignored_command':
                if (!command) { msg = 'No command specified.'; break; }
                MySQL.execute('DELETE FROM discord_permissions WHERE type = ? AND value = ?', ['ignored_command', command], (affectedRows) => {
                    msg = `Removed \`${command}\` from ignored commands.`;
                    interaction.reply({ content: msg, ephemeral: true });
                });
                return;
            case 'list':
                // List all roles and command permissions
                MySQL.query('SELECT * FROM discord_permissions', [], (result) => {
                    let adminRoles = result.filter(r => r.type === 'admin_role').map(r => `<@&${r.value}>`);
                    let modRoles = result.filter(r => r.type === 'mod_role').map(r => `<@&${r.value}>`);
                    let perms = result.filter(r => r.type === 'command_permission');
                    let ignored = result.filter(r => r.type === 'ignored_command').map(r => `\`${r.value}\``);
                    let msg = `**Admin Roles:** ${adminRoles.join(', ') || 'None'}\n`;
                    msg += `**Mod Roles:** ${modRoles.join(', ') || 'None'}\n`;
                    msg += `**Ignored Commands:** ${ignored.join(', ') || 'None'}\n`;
                    msg += '\n**Command Permissions:**\n';
                    const byCommand = {};
                    perms.forEach(p => {
                        if (!byCommand[p.value]) byCommand[p.value] = [];
                        byCommand[p.value].push(p.extra);
                    });
                    for (const [cmd, roles] of Object.entries(byCommand)) {
                        msg += `- ${cmd}: ${roles.join(', ') || 'None'}\n`;
                    }
                    interaction.reply({ content: msg, ephemeral: true });
                });
                return;
            default:
                msg = 'Unknown action.';
        }
        await interaction.reply({ content: msg, ephemeral: true });
    },
}; 
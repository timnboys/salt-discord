# salt-discord

A FiveM resource for Discord integration, providing in-game commands and player/job management via Discord slash commands.

---

## Installation

1. **Clone or Download**
   - Place the `salt-discord` folder in your `resources` directory.

2. **Dependencies**
   - Node.js (for Discord bot features)
   - FiveM server (FXServer)

3. **Install Node Modules**
   ```sh
   cd resources/salt-discord
   npm install
   ```

---

## Configuration

Add the following to your `server.cfg`:

```cfg
setr salt_discord_token "YOUR_BOT_TOKEN_HERE"
setr salt_discord_client_id "YOUR_BOT_CLIENT_ID_HERE"
ensure salt-discord
```

- Replace `YOUR_BOT_TOKEN_HERE` and `YOUR_BOT_CLIENT_ID_HERE` with your Discord bot credentials.

---

## Usage

### Discord Slash Commands

Below is a list of available Discord bot commands:

- **/ping**
  - Replies with Pong! (latency test)

- **/players**
  - Gets a list of all players currently on the server.

- **/givemoney**
  - Give money to a player by SID.
  - Options: `sid` (Player SID), `type` (bank or cash), `amount` (amount to give)

- **/giveitem**
  - Give an item to a player by SID.
  - Options: `sid` (Player SID), `item` (item name), `amount` (amount)

- **/giveweapon**
  - Give a weapon to a player by SID.
  - Options: `sid` (Player SID), `weapon` (weapon name), `ammo` (amount), `scractched` (True/False)

- **/addownedvehicle**
  - Add owned vehicle to player.
  - Options: `sid`, `hash` (vehicle model), `make`, `model`, `class`, `value`, `type` (0=Car, 1=Boat, 2=Aircraft)

- **/givejob**
  - Give a job to a player by SID.
  - Options: `sid`, `job`, `grade`, `workplace` (optional)

- **/removejob**
  - Remove a player's job by SID.
  - Options: `sid`, `job`

- **/setowner**
  - Set a job's owner by SID.
  - Options: `sid`, `job`

- **/checkjobs**
  - Shows the jobs a character has.
  - Options: `sid`

- **/getjobs**
  - Gets a list of all jobs currently on the server.
#### Example: Give a Job

```
/givejob target:1234 job:police grade:chief workplace:lspd
```

---

## Development

- **Commands** are located in `src/commands/`
- **Server logic** in `src/server.js` and `src/server.lua`
- **Client logic** in `src/client.lua`
- **Exports**: Lua and JS communicate via FiveM's `global.exports` and registered functions.

### Adding/Editing Commands

- Add new command files to `src/commands/`
- Each command exports a module with `name`, `description`, `options`, and `execute` function.

### Lua ↔ JS Communication

- Lua functions are registered and called from JS using `global.exports[GetCurrentResourceName()]`
- See `src/server.lua` for registered functions like `fetchJobs`, `fetchCharacter`, etc.

---

## Troubleshooting

- Ensure your bot token and client ID are correct in `server.cfg`
- Make sure the bot is invited to your Discord server with the correct permissions (slash commands, embeds)
- Check server console for errors if commands do not respond

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)

---

## Credits

- Developed by Salt
- Uses [discord.js](https://discord.js.org/) and FiveM natives

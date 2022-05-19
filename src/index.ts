import { Client } from '@knighthacks/scythe';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const client = new Client({
  intents: ['GUILDS'],
});

(async () => {
  await client.login(process.env['DISCORD_TOKEN']);
  await client.registerCommands(path.join(__dirname, 'commands'));
  client.registerAutocompleteHandlers(path.join(__dirname, 'autocomplete'));
})();

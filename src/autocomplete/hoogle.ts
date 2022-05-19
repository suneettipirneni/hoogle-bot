import { AutocompleteHandler } from '@knighthacks/scythe';
import { HoogleAPI } from '../HoogleAPI';
import { truncate } from '../util';

const hoogleHandler: AutocompleteHandler = {
  commandName: 'hoogle',
  async onAutocomplete(interaction) {
    const query = interaction.options.getString('query', true);

    if (query === '') {
      await interaction.respond([]);
      return;
    }

    const results = await HoogleAPI.search(query, { count: 5, format: 'text' });
    if (!results) {
      await interaction.respond([]);
      return;
    }

    await interaction.respond(
      results.map((result) => ({
        name: `${truncate(result.item, 50)}    (${truncate(
          result.module.name,
          41
        )})`,
        value: result.item.slice(0, 100),
      }))
    );
  },
};

export default hoogleHandler;

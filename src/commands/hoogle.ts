import { Command } from '@knighthacks/scythe';
import { HoogleAPI, HoogleResult } from '../HoogleAPI';
import TurndownService from 'turndown';
import { MessageEmbed } from 'discord.js';

const docsTurndown = new TurndownService()
  .addRule('code', {
    filter: ['pre'],
    replacement: (_, node) => `\n\`\`\`haskell\n
${node.textContent}
\`\`\`\n`,
  })
  .addRule('inlineCode', {
    // @ts-expect-error unknown element
    filter: ['a', 'tt'],
    replacement: (_, node) => `\`${node.textContent}\``,
  })
  .addRule('bold', {
    filter: ['h1', 'h2', 'h3', 'h4'],
    replacement: (content) => {
      return `\n\n**${content}**\n\n`;
    },
  });

function generateEmbed(result: HoogleResult) {
  const docsMarkdown = docsTurndown.turndown(result.docs);

  return new MessageEmbed()
    .setTitle(`\`${result.item}\``)
    .setURL(result.url)
    .addFields([
      {
        name: 'Package',
        value: `[${result.package.name}](${result.package.url})` ?? 'n/a',
      },
      {
        name: 'Module',
        value: `[${result.module.name}](${result.module.url})` ?? 'n/a',
      },
    ])
    .setDescription(docsMarkdown);
}

const hoogleCommand: Command = {
  name: 'hoogle',
  description: 'Look up haskell documentation on hoogle',
  options: [
    {
      name: 'query',
      type: 'STRING',
      autocomplete: true,
      required: true,
      description: 'The query to search hoogle',
    },
  ],
  async run({ interaction }) {
    await interaction.deferReply();
    const query = interaction.options.getString('query', true);

    const [result] = await HoogleAPI.search(query);
    const [textResult] = await HoogleAPI.search(query, { format: 'text' });

    if (!result || !textResult) {
      await interaction.followUp({
        content: `There was an error looking up '${query} on hoogle.'`,
        ephemeral: true,
      });
      return;
    }

    result.item = textResult.item;
    const embed = generateEmbed(result);

    await interaction.followUp({
      content: 'Hoogle Results:',
      embeds: [embed],
    });
  },
};

export default hoogleCommand;

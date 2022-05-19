import { Command } from '@knighthacks/scythe';

const PingCommand: Command = {
  name: 'ping',
  description: 'Displays bot ping latency',
  async run({ interaction }) {
    const message = await interaction.reply({
      content: 'Ping!',
      fetchReply: true,
    });

    await message.edit(
      `Pong! ${message.createdTimestamp - interaction.createdTimestamp}ms`
    );
  },
};

export default PingCommand;

const { SlashCommandBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('See the richest users'),

  async execute(interaction) {
    const all = await db.all();
    const wallets = all.filter(x => x.id.startsWith('wallet_'));

    const sorted = wallets.sort((a, b) => b.value - a.value).slice(0, 10);

    const leaderboard = await Promise.all(sorted.map(async (entry, i) => {
      const userId = entry.id.split('_')[1];
      const user = await interaction.client.users.fetch(userId).catch(() => null);
      return `${i + 1}. **${user ? user.username : 'Unknown'}** - 💰 ${entry.value}`;
    }));

    interaction.reply({
      embeds: [{
        color: 0xe74c3c,
        title: '🏆 Leaderboard (Wallet)',
        description: leaderboard.join('\n')
      }]
    });
  }
};

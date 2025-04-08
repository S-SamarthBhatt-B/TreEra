const { SlashCommandBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();
const badges = require('../../data/badges.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('claimbadge')
    .setDescription('Claim available badges based on your achievements'),

  async execute(interaction) {
    const userId = interaction.user.id;
    const unlocked = [];

    for (const badge of badges) {
      const key = `badge_${badge.id}_${userId}`;
      const alreadyClaimed = await db.get(key);
      if (alreadyClaimed) continue;

      let statValue = 0;
      switch (badge.condition.type) {
        case 'work':
          statValue = await db.get(`stats_work_${userId}`) || 0;
          break;
        case 'spend':
          statValue = await db.get(`stats_spend_${userId}`) || 0;
          break;
        case 'gamble_win':
          statValue = await db.get(`stats_gamble_wins_${userId}`) || 0;
          break;
      }

      if (statValue >= badge.condition.amount) {
        await db.set(key, true);
        unlocked.push(`${badge.name} — ${badge.description}`);
      }
    }

    if (unlocked.length === 0) {
      return interaction.reply({ content: '❌ You don’t meet the requirements for any badges yet!', flags: 64 });
    }

    interaction.reply({
      embeds: [{
        color: 0x00ff99,
        title: '🏅 Badges Claimed!',
        description: unlocked.join('\n')
      }]
    });
  }
};

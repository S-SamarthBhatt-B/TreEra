const { SlashCommandBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('View your command usage stats'),

  async execute(interaction) {
    const userId = interaction.user.id;

    const work = await db.get(`stats_work_${userId}`) || 0;
    const beg = await db.get(`stats_beg_${userId}`) || 0;
    const gamble = await db.get(`stats_gamble_${userId}`) || 0;

    interaction.reply({
      embeds: [{
        color: 0x2ecc71,
        title: `${interaction.user.username}'s Stats`,
        fields: [
          { name: '🔧 Work used', value: `${work}`, inline: true },
          { name: '🙌 Beg used', value: `${beg}`, inline: true },
          { name: '🎲 Gamble used', value: `${gamble}`, inline: true }
        ]
      }]
    });
  }
};

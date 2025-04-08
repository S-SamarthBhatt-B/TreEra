const { SlashCommandBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription("View your profile"),

  async execute(interaction) {
    const userId = interaction.user.id;
    const wallet = await db.get(`wallet_${userId}`) || 0;
    const bank = await db.get(`bank_${userId}`) || 0;
    const job = await db.get(`job_${userId}`) || 'Unemployed';
    const hasBadge = await db.get(`badge_${userId}`);
    const badge = hasBadge ? '🏅 Worker Badge' : '❌ None';

    const embed = {
      color: 0x3498db,
      title: `${interaction.user.username}'s Profile`,
      fields: [
        { name: '💰 Wallet', value: `${wallet}`, inline: true },
        { name: '🏦 Bank', value: `${bank}`, inline: true },
        { name: '🧰 Job', value: `${job}`, inline: true },
        { name: '🏅 Badge', value: badge, inline: true },
      ],
      footer: { text: 'Keep grinding to earn more badges!' }
    };

    interaction.reply({ embeds: [embed] });
  }
};

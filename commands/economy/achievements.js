const { SlashCommandBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();
const allAchievements = require('../../data/achievements.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('achievements')
    .setDescription('Check your unlocked achievements'),

  async execute(interaction) {
    const userId = interaction.user.id;

    // Gather user stats needed for achievements
    const stats = {
      wallet: await db.get(`wallet_${userId}`) || 0,
      work: await db.get(`stats_work_${userId}`) || 0,
      beg: await db.get(`stats_beg_${userId}`) || 0,
      gamble: await db.get(`stats_gamble_${userId}`) || 0,
      badge: await db.get(`badge_${userId}`),
      pet: await db.get(`pet_${userId}`),
      treatedPet: await db.get(`stats_treatpet_${userId}`) || 0,
      jobsSwitched: await db.get(`stats_jobs_switched_${userId}`) || 0,
      itemsBought: await db.get(`stats_items_bought_${userId}`) || 0,
      bank: await db.get(`bank_${userId}`) || 0,
      bankUpgraded: await db.get(`stats_bank_upgraded_${userId}`) || 0,
      totalSpent: await db.get(`stats_total_spent_${userId}`) || 0,
      dailyStreak: await db.get(`stats_daily_streak_${userId}`) || 0,
      wonGamble: await db.get(`stats_gamble_won_${userId}`) || 0,
      lostGamble: await db.get(`stats_gamble_lost_${userId}`) || 0,
      leaderboardTop10: false // You can implement leaderboard logic separately
    };

    const earnedAchievements = [];

    for (const ach of allAchievements) {
      switch (ach.id) {
        case 'rich_1':
          if (stats.wallet >= 1000) earnedAchievements.push(`💰 ${ach.name}`);
          break;
        case 'rich_2':
          if (stats.wallet >= 10000) earnedAchievements.push(`💰 ${ach.name}`);
          break;
        case 'rich_3':
          if (stats.wallet >= 100000) earnedAchievements.push(`💰 ${ach.name}`);
          break;
        case 'worker_1':
          if (stats.work >= 10) earnedAchievements.push(`🛠️ ${ach.name}`);
          break;
        case 'worker_2':
          if (stats.work >= 100) earnedAchievements.push(`🛠️ ${ach.name}`);
          break;
        case 'beggar_1':
          if (stats.beg >= 10) earnedAchievements.push(`🙇 ${ach.name}`);
          break;
        case 'gambler_1':
          if (stats.gamble >= 10) earnedAchievements.push(`🎰 ${ach.name}`);
          break;
        case 'gambler_2':
          if (stats.wonGamble >= 5) earnedAchievements.push(`🍀 ${ach.name}`);
          break;
        case 'gambler_3':
          if (stats.lostGamble >= 5) earnedAchievements.push(`💀 ${ach.name}`);
          break;
        case 'pet_1':
          if (stats.pet) earnedAchievements.push(`🐶 ${ach.name}`);
          break;
        case 'pet_2':
          if (stats.treatedPet >= 10) earnedAchievements.push(`🍼 ${ach.name}`);
          break;
        case 'job_1':
          if (stats.work >= 1) earnedAchievements.push(`👨‍💼 ${ach.name}`);
          break;
        case 'job_2':
          if (stats.jobsSwitched >= 5) earnedAchievements.push(`🔁 ${ach.name}`);
          break;
        case 'shop_1':
          if (stats.itemsBought >= 5) earnedAchievements.push(`🛒 ${ach.name}`);
          break;
        case 'shop_2':
          if (stats.totalSpent >= 10000) earnedAchievements.push(`💸 ${ach.name}`);
          break;
        case 'bank_1':
          if (stats.bank >= 1000) earnedAchievements.push(`🏦 ${ach.name}`);
          break;
        case 'bank_2':
          if (stats.bankUpgraded >= 1) earnedAchievements.push(`📈 ${ach.name}`);
          break;
        case 'daily_1':
          if (stats.dailyStreak >= 7) earnedAchievements.push(`📅 ${ach.name}`);
          break;
        case 'badge_1':
          if (stats.badge) earnedAchievements.push(`🏅 ${ach.name}`);
          break;
        case 'leaderboard_1':
          if (stats.leaderboardTop10) earnedAchievements.push(`🥇 ${ach.name}`);
          break;
      }
    }

    if (earnedAchievements.length === 0) {
      earnedAchievements.push('❌ No achievements yet. Keep grinding!');
    }

    await interaction.reply({
      embeds: [{
        color: 0x00bfff,
        title: `${interaction.user.username}'s Achievements`,
        description: earnedAchievements.join('\n')
      }]
    });
  }
};

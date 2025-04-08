const { SlashCommandBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();
const jobs = require('../../data/jobs.json');
const eco = require('../../utils/economy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('work')
    .setDescription('Work at your job to earn money!'),

  async execute(interaction) {
    const userId = interaction.user.id;
    const jobName = await db.get(`job_${userId}`);
    const cooldownTime = 30 * 60 * 1000; // 30 minutes

    if (!jobName) {
      return interaction.reply({ content: '❌ You don’t have a job. Use /jobs to see available jobs.', flags: 64 });
    }

    const job = jobs.find(j => j.name.toLowerCase() === jobName.toLowerCase());
    if (!job) {
      return interaction.reply({ content: '❌ Your job is not valid anymore. Please /leavejob and choose again.', flags: 64 });
    }

    const inventory = await eco.getInventory(userId);
    if (!inventory[job.requiredTool] || inventory[job.requiredTool] <= 0) {
      return interaction.reply({ content: `❌ You need a **${job.requiredTool}** to work as a **${job.name}**.`, flags: 64 });
    }

    const lastWorked = await db.get(`last_work_${userId}`) || 0;
    const now = Date.now();
    const remaining = cooldownTime - (now - lastWorked);
    if (remaining > 0) {
      const minutes = Math.ceil(remaining / 60000);
      return interaction.reply({ content: `⏳ You need to wait **${minutes} more min** before working again.`, flags: 64 });
    }

    // ✅ Use correct keys from jobs.json
    const earnings = Math.floor(Math.random() * (job.maxEarnings - job.minEarnings + 1)) + job.minEarnings;

    await eco.addWallet(userId, earnings);
    await db.set(`last_work_${userId}`, now);

    // ➕ Increment work stat
    await db.add(`stats_work_${userId}`, 1);

    return interaction.reply({ content: `🛠️ You worked as a **${job.name}** and earned **${earnings} coins**!`, flags: 64 });
  }
};

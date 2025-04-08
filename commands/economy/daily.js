const { SlashCommandBuilder } = require('discord.js');
const eco = require('../../utils/economy.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Claim your daily reward (every 24 hours)'),
  async execute(interaction) {
    const userId = interaction.user.id;
    const cooldown = 24 * 60 * 60 * 1000; // 24 hours
    const lastUsed = await db.get(`daily_${userId}`);

    if (lastUsed && Date.now() - lastUsed < cooldown) {
      const timeLeft = cooldown - (Date.now() - lastUsed);
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      return interaction.reply({
        content: `🕐 You already claimed your daily. Come back in **${hours}h ${minutes}m**.`,
        ephemeral: true
      });
    }

    const reward = Math.floor(Math.random() * 300) + 200; // 200–500 coins
    await eco.addWallet(userId, reward);
    await db.set(`daily_${userId}`, Date.now());

    interaction.reply({
      content: `✅ You claimed your daily reward and got **${reward} coins**!`,
      ephemeral: false
    });
  },
};

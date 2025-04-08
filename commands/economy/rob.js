const { SlashCommandBuilder } = require('discord.js');
const eco = require('../../utils/economy.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rob')
    .setDescription('Attempt to rob another user')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('User to rob')
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.user;
    const target = interaction.options.getUser('target');
    const cooldown = 10 * 60 * 1000; // 10 minutes
    const lastRob = await db.get(`rob_cooldown_${user.id}`);

    // Check cooldown
    if (lastRob && Date.now() - lastRob < cooldown) {
      const timeLeft = cooldown - (Date.now() - lastRob);
      const minutes = Math.floor(timeLeft / 60000);
      const seconds = Math.floor((timeLeft % 60000) / 1000);

      return interaction.reply({
        content: `🕐 You must wait **${minutes}m ${seconds}s** before robbing again.`,
        ephemeral: true
      });
    }

    if (target.id === user.id) {
      return interaction.reply({ content: `❌ You can't rob yourself.`, ephemeral: true });
    }

    const userWallet = await eco.getWallet(user.id);
    const targetWallet = await eco.getWallet(target.id);

    if (targetWallet < 100) {
      return interaction.reply({ content: `❌ ${target.username} doesn't have enough money to rob.`, ephemeral: true });
    }

    const stolen = Math.floor(Math.random() * (targetWallet / 2)) + 50; // 50 to half of target wallet
    const finalAmount = stolen > targetWallet ? targetWallet : stolen;

    await eco.removeWallet(target.id, finalAmount);
    await eco.addWallet(user.id, finalAmount);
    await db.set(`rob_cooldown_${user.id}`, Date.now());

    interaction.reply(`🦹 You robbed **${finalAmount} coins** from ${target.username}! 💰`);
  },
};

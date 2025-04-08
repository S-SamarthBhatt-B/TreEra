const { SlashCommandBuilder } = require('discord.js');
const eco = require('../../utils/economy.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gamble')
    .setDescription('Gamble your coins in a coinflip')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Amount of coins to gamble')
        .setRequired(true)
    ),

  async execute(interaction) {
    const userId = interaction.user.id;
    const amount = interaction.options.getInteger('amount');

    const cooldown = 60 * 1000; // 1 minute
    const lastUsed = await db.get(`gamble_cooldown_${userId}`);

    if (lastUsed && Date.now() - lastUsed < cooldown) {
      const timeLeft = cooldown - (Date.now() - lastUsed);
      const seconds = Math.floor(timeLeft / 1000);
      return interaction.reply({
        content: `⏳ Please wait **${seconds} seconds** before gambling again.`,
        ephemeral: true,
      });
    }

    const wallet = await eco.getWallet(userId);
    if (amount <= 0) {
      return interaction.reply({ content: `❌ You must gamble more than 0 coins.`, ephemeral: true });
    }

    if (wallet < amount) {
      return interaction.reply({ content: `❌ You don't have enough coins to gamble!`, ephemeral: true });
    }

    const win = Math.random() < 0.5;

    if (win) {
      await eco.addWallet(userId, amount);
      interaction.reply(`🎉 You won the coinflip and gained **${amount} coins**!`);
    } else {
      await eco.removeWallet(userId, amount);
      interaction.reply(`💀 You lost the coinflip and lost **${amount} coins**...`);
    }

    await db.set(`gamble_cooldown_${userId}`, Date.now());

    // ➕ Track gamble stat
    await db.add(`stats_gamble_${userId}`, 1);
  }
};

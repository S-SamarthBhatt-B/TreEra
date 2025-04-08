const { SlashCommandBuilder } = require('discord.js');
const eco = require('../../utils/economy.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('upgradebank')
    .setDescription('Upgrade your bank storage')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('How much storage to add (1 = 10 coins, 1 = 100 space)')
        .setRequired(true)
    ),

  async execute(interaction) {
    const userId = interaction.user.id;
    const units = interaction.options.getInteger('amount');

    if (units <= 0) {
      return interaction.reply({ content: '❌ You must upgrade at least 1 unit.', ephemeral: true });
    }

    const costPerUnit = 10;
    const totalCost = units * costPerUnit;
    const wallet = await eco.getWallet(userId);

    if (wallet < totalCost) {
      return interaction.reply({
        content: `❌ You need **${totalCost} coins**, but you only have **${wallet}**.`,
        ephemeral: true
      });
    }

    await eco.removeWallet(userId, totalCost);
    await eco.addBankSpace(userId, units * 100); // 1 unit = 100 space

    return interaction.reply({
      content: `🏦 You upgraded your bank by **${units * 100} space** for **${totalCost} coins**.`,
      ephemeral: false
    });
  }
};

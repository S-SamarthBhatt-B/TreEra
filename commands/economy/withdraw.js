const { SlashCommandBuilder } = require('discord.js');
const eco = require('../../utils/economy.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('withdraw')
    .setDescription('Withdraw coins from bank to wallet')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Amount to withdraw (or 0 for all)')
        .setRequired(true)),

  async execute(interaction) {
    const userId = interaction.user.id;
    const amount = interaction.options.getInteger('amount');

    let bank = await eco.getBank(userId);

    if (amount === 0) {
      if (bank === 0) {
        return interaction.reply({ content: '❌ You have no coins to withdraw.', ephemeral: true });
      }

      await eco.removeBank(userId, bank);
      await eco.addWallet(userId, bank);
      return interaction.reply(`✅ Withdrew **${bank} coins** to your wallet.`);
    }

    if (amount < 1 || amount > bank) {
      return interaction.reply({ content: `❌ Invalid amount. You only have **${bank} coins** in your bank.`, ephemeral: true });
    }

    await eco.removeBank(userId, amount);
    await eco.addWallet(userId, amount);
    interaction.reply(`✅ Withdrew **${amount} coins** to your wallet.`);
  },
};

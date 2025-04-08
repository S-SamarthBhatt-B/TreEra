const { SlashCommandBuilder } = require('discord.js');
const eco = require('../../utils/economy.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('deposit')
    .setDescription('Deposit coins from wallet to bank')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Amount to deposit (or 0 for all)')
        .setRequired(true)),

  async execute(interaction) {
    const userId = interaction.user.id;
    const amount = interaction.options.getInteger('amount');

    let wallet = await eco.getWallet(userId);
    let bank = await eco.getBank(userId);
    let bankSpace = await eco.getBankSpace(userId);

    let availableSpace = bankSpace - bank;

    if (amount === 0) {
      if (wallet === 0) {
        return interaction.reply({ content: '❌ You have no coins to deposit.', ephemeral: true });
      }

      const depositAmount = Math.min(wallet, availableSpace);
      if (depositAmount === 0) {
        return interaction.reply({ content: '❌ Your bank is full.', ephemeral: true });
      }

      await eco.removeWallet(userId, depositAmount);
      await eco.addBank(userId, depositAmount);
      return interaction.reply(`✅ Deposited **${depositAmount} coins** to your bank.`);
    }

    if (amount < 1 || amount > wallet) {
      return interaction.reply({ content: `❌ Invalid amount. You only have **${wallet} coins** in your wallet.`, ephemeral: true });
    }

    if (amount > availableSpace) {
      return interaction.reply({ content: `❌ Not enough space in your bank. You can only deposit **${availableSpace} coins**.`, ephemeral: true });
    }

    await eco.removeWallet(userId, amount);
    await eco.addBank(userId, amount);
    interaction.reply(`✅ Deposited **${amount} coins** to your bank.`);
  },
};

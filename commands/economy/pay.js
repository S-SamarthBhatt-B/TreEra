const { SlashCommandBuilder } = require('discord.js');
const eco = require('../../utils/economy.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pay')
    .setDescription('Send coins to another user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to pay')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Amount to send')
        .setRequired(true)),

  async execute(interaction) {
    const senderId = interaction.user.id;
    const target = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');

    if (target.bot) return interaction.reply({ content: '❌ You cannot pay bots.', ephemeral: true });
    if (target.id === senderId) return interaction.reply({ content: '❌ You cannot pay yourself.', ephemeral: true });
    if (amount <= 0) return interaction.reply({ content: '❌ Amount must be more than zero.', ephemeral: true });

    const senderBalance = await eco.getWallet(senderId);

    if (senderBalance < amount) {
      return interaction.reply({ content: `❌ You don't have enough coins. Your wallet: **${senderBalance}**`, ephemeral: true });
    }

    await eco.removeWallet(senderId, amount);
    await eco.addWallet(target.id, amount);

    interaction.reply(`✅ You paid **${amount} coins** to ${target.username}.`);
  }
};

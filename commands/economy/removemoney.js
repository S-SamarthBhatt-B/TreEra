const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const eco = require('../../utils/economy.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removemoney')
    .setDescription('Remove money from a user’s wallet or bank (admin only)')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to remove money from')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Amount of money to remove')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('location')
        .setDescription('Where to remove the money from')
        .setRequired(true)
        .addChoices(
          { name: 'Wallet', value: 'wallet' },
          { name: 'Bank', value: 'bank' }
        ))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ content: '❌ You need Administrator permission to use this command.', ephemeral: true });
    }

    const target = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');
    const location = interaction.options.getString('location');

    if (amount <= 0) {
      return interaction.reply({ content: '❌ Amount must be more than 0.', ephemeral: true });
    }

    if (location === 'wallet') {
      await eco.removeWallet(target.id, amount);
    } else {
      await eco.removeBank(target.id, amount);
    }

    interaction.reply(`✅ Successfully removed **${amount} coins** from ${target.username}'s **${location}**.`);
  }
};

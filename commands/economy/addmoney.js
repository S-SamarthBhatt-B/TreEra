const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const eco = require('../../utils/economy.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addmoney')
    .setDescription('Add money to a user’s wallet or bank (admin only)')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to give money to')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Amount of money to give')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('location')
        .setDescription('Where to add the money')
        .setRequired(true)
        .addChoices(
          { name: 'Wallet', value: 'wallet' },
          { name: 'Bank', value: 'bank' }
        ))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    // Extra check just in case
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
      await eco.addWallet(target.id, amount);
    } else {
      await eco.addBank(target.id, amount);
    }

    interaction.reply(`✅ Successfully added **${amount} coins** to ${target.username}'s **${location}**.`);
  }
};

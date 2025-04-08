const { SlashCommandBuilder } = require('discord.js');
const eco = require('../../utils/economy.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bank')
    .setDescription('Check your bank balance and capacity'),

  async execute(interaction) {
    const userId = interaction.user.id;

    const bankBalance = await eco.getBank(userId);
    const bankSpace = await eco.getBankSpace(userId);

    interaction.reply({
      content: `🏦 **Bank Info**\nBalance: **${bankBalance} coins**\nCapacity: **${bankSpace} coins**`,
      ephemeral: false,
    });
  },
};

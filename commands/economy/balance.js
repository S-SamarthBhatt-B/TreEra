const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const eco = require('../../utils/economy.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your wallet and bank balance'),
  async execute(interaction) {
    const userId = interaction.user.id;

    const wallet = await eco.getWallet(userId);
    const bank = await eco.getBank(userId);

    const embed = new EmbedBuilder()
      .setTitle(`${interaction.user.username}'s Balance`)
      .setColor(0x00FF00)
      .addFields(
        { name: '💰 Wallet', value: `${wallet} coins`, inline: true },
        { name: '🏦 Bank', value: `${bank} coins`, inline: true }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

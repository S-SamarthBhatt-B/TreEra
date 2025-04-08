const { SlashCommandBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('inventory')
    .setDescription('Check your inventory'),

  async execute(interaction) {
    const userId = interaction.user.id;
    const inv = await db.get(`inventory_${userId}`) || {};

    if (Object.keys(inv).length === 0) {
      return interaction.reply({ content: '🎒 Your inventory is empty!', ephemeral: false });
    }

    const inventoryList = Object.entries(inv).map(([item, qty]) => `**${item}** x${qty}`).join('\n');

    interaction.reply({
      embeds: [{
        title: `${interaction.user.username}'s Inventory`,
        description: inventoryList,
        color: 0x9acd32
      }],
      ephemeral: false
    });
  },
};

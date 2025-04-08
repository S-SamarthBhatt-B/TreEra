const { SlashCommandBuilder } = require('discord.js');
const items = require('../../data/items.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shop')
    .setDescription('View available items to buy'),

  async execute(interaction) {
    const itemList = items.map(item => `**${item.name}** - ${item.price} coins\n*${item.description}*`).join('\n\n');

    interaction.reply({
      embeds: [{
        title: '🛒 TreEra Shop',
        description: itemList || 'No items available.',
        color: 0x00bfff
      }],
      ephemeral: false
    });
  },
};

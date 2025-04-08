const { SlashCommandBuilder } = require('discord.js');
const items = require('../../data/items.json');
const eco = require('../../utils/economy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sellitem')
    .setDescription('Sell an item from your inventory')
    .addStringOption(option =>
      option.setName('item')
        .setDescription('Name of the item to sell')
        .setRequired(true)
    ),

  async execute(interaction) {
    const userId = interaction.user.id;
    const itemName = interaction.options.getString('item').toLowerCase();
    const item = items.find(i => i.name.toLowerCase() === itemName);

    if (!item || !item.sellPrice) {
      return interaction.reply({ content: '❌ This item can’t be sold.', ephemeral: true });
    }

    const inventory = await eco.getInventory(userId);
    if (!inventory[item.name] || inventory[item.name] <= 0) {
      return interaction.reply({ content: `❌ You don't own any **${item.name}**.`, ephemeral: true });
    }

    inventory[item.name] -= 1;
    if (inventory[item.name] <= 0) delete inventory[item.name];
    await eco.setInventory(userId, inventory);
    await eco.addWallet(userId, item.sellPrice);

    interaction.reply({ content: `✅ You sold **${item.name}** for **${item.sellPrice} coins**.` });
  }
};

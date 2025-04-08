const { SlashCommandBuilder } = require('discord.js');
const items = require('../../data/items.json');
const eco = require('../../utils/economy');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('buyitem')
    .setDescription('Buy an item from the shop')
    .addStringOption(option =>
      option.setName('item')
        .setDescription('Name of the item to buy')
        .setRequired(true)
    ),

  async execute(interaction) {
    const userId = interaction.user.id;
    const itemName = interaction.options.getString('item').toLowerCase();
    const item = items.find(i => i.name.toLowerCase() === itemName);

    if (!item) {
      return interaction.reply({ content: '❌ Item not found in the shop.', ephemeral: true });
    }

    const userWallet = await eco.getWallet(userId);
    if (userWallet < item.price) {
      return interaction.reply({
        content: `💸 You need **${item.price} coins** to buy this item.`,
        ephemeral: true
      });
    }

    // Deduct money
    await eco.removeWallet(userId, item.price);

    // Add to inventory
    const inventory = await eco.getInventory(userId);
    inventory[item.name] = (inventory[item.name] || 0) + 1;
    await eco.setInventory(userId, inventory);

    // Handle pet purchase
    if (item.type === 'pet') {
      const ownedPets = (await db.get(`pets_${userId}`)) || [];

      if (!ownedPets.includes(item.name)) {
        ownedPets.push(item.name);
        await db.set(`pets_${userId}`, ownedPets);

        // Optional: Initialize pet stats (happiness, etc.)
        await db.set(`petstats_${userId}_${item.name}`, {
          happiness: 100,
          lastFed: Date.now()
        });
      }
    }

    return interaction.reply({
      content: `✅ You bought **${item.emoji || ''} ${item.name}** for **${item.price} coins**.`
    });
  }
};

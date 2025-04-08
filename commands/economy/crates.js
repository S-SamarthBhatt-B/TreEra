const { SlashCommandBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();
const eco = require('../../utils/economy.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('opencrate')
    .setDescription('Open a crate to receive a random item (cooldown: 1 day)'),

  async execute(interaction) {
    const userId = interaction.user.id;
    const cooldown = 24 * 60 * 60 * 1000; // 1 day cooldown
    const lastUsed = await db.get(`crate_cooldown_${userId}`);

    if (lastUsed && Date.now() - lastUsed < cooldown) {
      const timeLeft = cooldown - (Date.now() - lastUsed);
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      return interaction.reply({
        content: `⏳ Please wait **${hours}h ${minutes}m** before opening another crate.`,
        ephemeral: true
      });
    }

    // Random item for the crate
    const items = [
      { name: 'Special Pickaxe', type: 'tool', description: 'A rare pickaxe that increases work efficiency.' },
      { name: 'Double Coins Boost', type: 'boost', description: 'Double your coins earned for 1 hour.' },
      { name: 'Mystery Pet', type: 'pet', description: 'A random pet with special abilities.' },
      { name: 'Golden Hammer', type: 'tool', description: 'A rare hammer used for advanced jobs.' },
      { name: 'Lucky Coin', type: 'boost', description: 'A coin that gives you a chance for extra coins during work.' }
    ];

    const randomItem = items[Math.floor(Math.random() * items.length)];

    // Add the item to user's inventory or apply the boost
    if (randomItem.type === 'tool') {
      await eco.addItemToInventory(userId, randomItem.name, 1);
    } else if (randomItem.type === 'boost') {
      await eco.addBoost(userId, randomItem.name);
    } else if (randomItem.type === 'pet') {
      await eco.addPet(userId, randomItem.name);
    }

    await db.set(`crate_cooldown_${userId}`, Date.now());

    return interaction.reply({
      content: `🎉 You opened a crate and received a **${randomItem.name}**! ${randomItem.description}`,
    });
  }
};

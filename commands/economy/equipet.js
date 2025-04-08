const { SlashCommandBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();
const pets = require('../../data/pets.json'); // Create a pets.json or use your items.json filter

module.exports = {
  data: new SlashCommandBuilder()
    .setName('equipet')
    .setDescription('Equip a pet to help you during jobs.')
    .addStringOption(option =>
      option.setName('pet')
        .setDescription('The name of the pet you want to equip')
        .setRequired(true)
    ),

  async execute(interaction) {
    const userId = interaction.user.id;
    const chosen = interaction.options.getString('pet').toLowerCase();

    const ownedPets = await db.get(`pets_${userId}`) || [];
    const match = ownedPets.find(p => p.toLowerCase() === chosen);

    if (!match) {
      return interaction.reply({ content: `❌ You don't own a pet named **${chosen}**.`, ephemeral: true });
    }

    await db.set(`equipped_pet_${userId}`, match);
    return interaction.reply({ content: `✅ You have equipped **${match}** as your active pet.` });
  }
};

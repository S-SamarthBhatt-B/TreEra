const { SlashCommandBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mypets')
    .setDescription('View all the pets you own.'),

  async execute(interaction) {
    const userId = interaction.user.id;
    const pets = await db.get(`pets_${userId}`) || [];

    if (pets.length === 0) {
      return interaction.reply({ content: '😿 You don’t own any pets yet. Buy one from the shop!', ephemeral: true });
    }

    const equipped = await db.get(`equipped_pet_${userId}`);
    const list = pets.map(p => (p === equipped ? `⭐ **${p}** (equipped)` : `- ${p}`)).join('\n');

    return interaction.reply({
      embeds: [
        {
          title: '🐾 Your Pets',
          description: list,
          color: 0xFFA500,
        },
      ],
    });
  }
};

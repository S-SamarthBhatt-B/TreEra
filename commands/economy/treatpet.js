const { SlashCommandBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('treatpet')
    .setDescription('Give your equipped pet a treat to make it happier!'),

  async execute(interaction) {
    const userId = interaction.user.id;
    const equippedPet = await db.get(`equipped_pet_${userId}`);

    if (!equippedPet) {
      return interaction.reply({ content: '❌ You have no pet equipped.', ephemeral: true });
    }

    // Cooldown: 1 day (24 hrs)
    const cooldown = 24 * 60 * 60 * 1000; // 86,400,000 ms
    const lastUsed = await db.get(`pet_treat_cd_${userId}`);
    const now = Date.now();

    if (lastUsed && now - lastUsed < cooldown) {
      const remaining = cooldown - (now - lastUsed);
      const hours = Math.floor(remaining / (60 * 60 * 1000));
      const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
      return interaction.reply({
        content: `⏳ You can treat your pet again in **${hours} hour(s) and ${minutes} minute(s)**.`,
        ephemeral: true
      });
    }

    // Random happiness increase (0–3%)
    const randomIncrease = Math.floor(Math.random() * 4);
    const petStatsKey = `pet_stats_${userId}`;
    const petStats = await db.get(petStatsKey) || {};
    const happiness = petStats.happiness || 0;

    const newHappiness = Math.min(happiness + randomIncrease, 100);
    await db.set(petStatsKey, { ...petStats, happiness: newHappiness });

    // Save cooldown
    await db.set(`pet_treat_cd_${userId}`, now);

    return interaction.reply({
      content: `🦴 You treated **${equippedPet}**! Happiness increased by **${randomIncrease}%**, now at **${newHappiness}%**! 🐾`
    });
  },
};

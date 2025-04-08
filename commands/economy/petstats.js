const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();
const items = require('../../data/items.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('petstats')
    .setDescription("View your pet's stats"),

  async execute(interaction) {
    const userId = interaction.user.id;
    const petName = await db.get(`equipped_pet_${userId}`);

    if (!petName) {
      return interaction.reply({ content: "😿 You don't have a pet equipped!", ephemeral: true });
    }

    const pet = items.find(i => i.name.toLowerCase() === petName.toLowerCase() && i.type === 'pet');
    if (!pet) {
      return interaction.reply({ content: "❌ Could not find details for your equipped pet.", ephemeral: true });
    }

    const happiness = await db.get(`pet_happiness_${userId}`) || 50;
    const level = await db.get(`pet_level_${userId}`) || 1;
    const xp = await db.get(`pet_xp_${userId}`) || 0;

    const embed = new EmbedBuilder()
      .setColor(0x00ff99)
      .setTitle(`${pet.emoji || "🐾"} ${pet.name}'s Stats`)
      .addFields(
        { name: "📊 Level", value: `${level}`, inline: true },
        { name: "🎯 XP", value: `${xp}/100`, inline: true },
        { name: "😊 Happiness", value: `${happiness}%`, inline: true },
        { name: "🧠 Ability", value: `${pet.ability || 'None'}`, inline: false }
      );

    interaction.reply({ embeds: [embed] });
  }
};

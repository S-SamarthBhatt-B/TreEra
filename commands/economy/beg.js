const { SlashCommandBuilder } = require('discord.js');
const eco = require('../../utils/economy.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('beg')
    .setDescription('Beg for some coins (cooldown: 2 minutes)'),

  async execute(interaction) {
    const userId = interaction.user.id;
    const cooldown = 2 * 60 * 1000; // 2 minutes
    const lastUsed = await db.get(`beg_${userId}`);

    if (lastUsed && Date.now() - lastUsed < cooldown) {
      const timeLeft = cooldown - (Date.now() - lastUsed);
      const minutes = Math.floor(timeLeft / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
      return interaction.reply({
        content: `⏳ You're feeling too embarrassed to beg again. Try in **${minutes}m ${seconds}s**.`,
        ephemeral: true,
      });
    }

    const responses = [
      `A kind soul gave you`,
      `Someone threw coins at you... and you caught them!`,
      `A stranger took pity and gave you`,
      `You found some loose change on the street:`,
      `You begged... and someone handed you`
    ];
    const response = responses[Math.floor(Math.random() * responses.length)];
    const amount = Math.floor(Math.random() * 100) + 1; // 1–100 coins

    await eco.addWallet(userId, amount);
    await db.set(`beg_${userId}`, Date.now());

    // ➕ Track beg stat
    await db.add(`stats_beg_${userId}`, 1);

    interaction.reply({
      content: `🙌 ${response} **${amount} coins**!`,
    });
  },
};

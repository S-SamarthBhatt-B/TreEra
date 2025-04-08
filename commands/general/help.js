const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show general help menu for TreEra'),

  async execute(interaction) {
    await interaction.reply({
      embeds: [{
        color: 0x00bfff,
        title: '📘 TreEra Help Menu',
        description: 'Welcome to **TreEra**! Here’s what you can do:',
        fields: [
          {
            name: '💰 Economy',
            value: '`/balance`, `/daily`, `/beg`, `/work`, `/gamble`, `/rob`, `/deposit`, `/withdraw`, `/pay`'
          },
          {
            name: '🛍️ Shop & Inventory',
            value: '`/shop`, `/buy`, `/sell`, `/inventory`, `/useitem`'
          },
          {
            name: '👷 Jobs & Crates',
            value: '`/jobs`, `/joinjob`, `/leavejob`, `/work`, `/opencrate`'
          },
          {
            name: '🐾 Pets & Boosts',
            value: '`/equipet`, `/treatpet`, `/mypet`, `/trainpet`'
          },
          {
            name: '🎯 Quests & Achievements',
            value: '`/quest`, `/achievements`, `/claimbadge`, `/badges`'
          },
          {
            name: '📊 Stats & Leaderboards',
            value: '`/profile`, `/stats`, `/leaderboard`'
          },
          {
            name: '⚙️ Admin',
            value: '`/addmoney`, `/removemoney` *(Admin only)*'
          }
        ],
        footer: {
          text: 'Use /commandname for more info. Happy grinding!',
        }
      }],
      flags: 64
    });
  }
};

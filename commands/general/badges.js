const { SlashCommandBuilder } = require('discord.js');
const badges = require('../../data/badges.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('badges')
    .setDescription('View all available badges in the bot'),

  async execute(interaction) {
    const badgeList = badges.map(b => `**${b.name}**\n> ${b.description}`).join('\n\n');

    return interaction.reply({
      embeds: [{
        color: 0x3498db,
        title: '🏅 All Available Badges',
        description: badgeList
      }],
      ephemeral: true
    });
  }
};

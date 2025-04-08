const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const jobs = require('../../data/jobs.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('jobs')
    .setDescription('View all available jobs'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('🧰 Available Jobs')
      .setColor(0x00AE86)
      .setDescription('Use `/joinjob <job>` to join one of these! You can only have **one job** at a time.')
      .setFooter({ text: 'Make sure you own the required tool!' });

    jobs.forEach(job => {
      embed.addFields({
        name: `${job.emoji} ${job.name}`,
        value: `**${job.description}**\n🛠️ Tool: \`${job.requiredTool}\`\n💰 Pay: \`${job.minEarnings} - ${job.maxEarnings} coins\``,
        inline: false
      });
    });

    await interaction.reply({ embeds: [embed] });
  }
};

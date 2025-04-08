const { SlashCommandBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leavejob')
    .setDescription('Leave your current job'),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true }); // Defer the reply for better handling

    const userId = interaction.user.id;
    const currentJob = await db.get(`job_${userId}`);

    if (!currentJob) {
      return interaction.editReply({ content: "❌ You don't have a job to leave." });
    }

    await db.delete(`job_${userId}`);
    return interaction.editReply({ content: `✅ You left your job as a **${currentJob}**.` });
  }
};

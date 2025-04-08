const { SlashCommandBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();
const jobs = require('../../data/jobs.json');
const eco = require('../../utils/economy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('joinjob')
    .setDescription('Join a job')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('Name of the job')
        .setRequired(true)
        .setAutocomplete(true)
    ),

  // 👇 Autocomplete handler
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused().toLowerCase();
    const choices = jobs.map(job => job.name);
    const filtered = choices.filter(choice =>
      choice.toLowerCase().includes(focusedValue)
    );

    await interaction.respond(
      filtered.map(choice => ({ name: choice, value: choice }))
    );
  },

  // 👇 Main command handler
  async execute(interaction) {
    const userId = interaction.user.id;
    const jobName = interaction.options.getString('name').toLowerCase();

    const currentJob = await db.get(`job_${userId}`);
    if (currentJob) {
      return interaction.reply({
        content: `❌ You're already working as a **${currentJob}**. Use /leavejob to change jobs.`,
        ephemeral: true
      });
    }

    const job = jobs.find(j => j.name.toLowerCase() === jobName);
    if (!job) {
      return interaction.reply({ content: '❌ Job not found.', ephemeral: true });
    }

    const inventory = await eco.getInventory(userId);
    if (!inventory[job.requiredTool] || inventory[job.requiredTool] <= 0) {
      return interaction.reply({
        content: `❌ You need a **${job.requiredTool}** to work as a **${job.name}**.`,
        ephemeral: true
      });
    }

    await db.set(`job_${userId}`, job.name);
    return interaction.reply({
      content: `✅ You joined the job **${job.emoji} ${job.name}**!`,
      ephemeral: true
    });
  }
};

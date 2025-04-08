module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    // ✅ Handle slash commands
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      // Commands allowed in DMs
      const dmAllowed = ['help', 'profile', 'invite'];

      // Restrict commands in DMs if not allowed
      if (!interaction.guild && !dmAllowed.includes(interaction.commandName)) {
        return interaction.reply({
          content: '❌ This command can only be used in servers.',
          ephemeral: true
        });
      }

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(`❌ Error executing ${interaction.commandName}:`, error);
        // ✅ Use editReply if already replied or deferred
        if (interaction.deferred || interaction.replied) {
          await interaction.editReply({
            content: '❌ There was an error while executing this command!'
          }).catch(console.error);
        } else {
          await interaction.reply({
            content: '❌ There was an error while executing this command!',
            ephemeral: true
          }).catch(console.error);
        }
      }
    }

    // ✅ Handle autocomplete interactions
    if (interaction.isAutocomplete()) {
      const command = client.commands.get(interaction.commandName);
      if (!command || !command.autocomplete) return;

      try {
        await command.autocomplete(interaction);
      } catch (error) {
        console.error(`❌ Autocomplete error in ${interaction.commandName}:`, error);
      }
    }
  },
};

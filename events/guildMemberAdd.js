const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
  name: 'guildMemberAdd',

  async execute(member, client) {
    const userId = member.user.id;
    const guildId = member.guild.id;

    // Optional: use guild-specific key (if you want per-server economy)
    const walletKey = `wallet_${guildId}_${userId}`;

    const existingWallet = await db.get(walletKey);
    if (existingWallet === null) {
      await db.set(walletKey, 1000);
      await db.set(`bank_${guildId}_${userId}`, 0);
      await db.set(`bankCap_${guildId}_${userId}`, 1000);

      // Optional: DM welcome message
      try {
        await member.send(`👋 Welcome to **${member.guild.name}**!\nYou’ve received 💰 **1000 coins** to get started.`);
      } catch (err) {
        console.log(`Couldn't DM ${member.user.tag}, but wallet was created.`);
      }

      console.log(`✅ Wallet created for ${member.user.tag} with 1000 coins.`);
    }
  }
};

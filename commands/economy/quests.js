const { SlashCommandBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();
const eco = require('../../utils/economy.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quest')
    .setDescription('Check your available quests and earn rewards for completing them'),

  async execute(interaction) {
    const userId = interaction.user.id;

    // Check if the user already has an active quest
    const currentQuest = await db.get(`current_quest_${userId}`);

    if (currentQuest) {
      return interaction.reply({
        content: `✅ You already have a quest: **${currentQuest.title}**\nComplete it to receive your rewards!`,
        ephemeral: true
      });
    }

    // Define quests
    const quests = [
      {
        title: 'Work Hard',
        description: 'Work 5 times to earn rewards.',
        reward: { type: 'coins', amount: 100 },
        condition: { type: 'work', amount: 5 }
      },
      {
        title: 'Gamble Win',
        description: 'Win 3 gambles to earn a reward.',
        reward: { type: 'coins', amount: 150 },
        condition: { type: 'gamble_win', amount: 3 }
      },
      {
        title: 'Beg for Coins',
        description: 'Beg 10 times to receive a special item.',
        reward: { type: 'item', itemName: 'Lucky Coin' },
        condition: { type: 'beg', amount: 10 }
      }
    ];

    // Randomly pick a quest
    const quest = quests[Math.floor(Math.random() * quests.length)];

    // Store the quest for the user
    await db.set(`current_quest_${userId}`, quest);

    return interaction.reply({
      content: `🎯 New Quest!\n**${quest.title}**: ${quest.description}\nReward: ${quest.reward.type === 'coins' ? `${quest.reward.amount} coins` : quest.reward.itemName}\nGood luck completing your quest!`,
    });
  }
};

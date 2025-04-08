// ✅ economy.js with guild support (Recommended)
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
  // 💰 Wallet & Bank System
  async getWallet(userId, guildId) {
    return (await db.get(`wallet_${guildId}_${userId}`)) || 0;
  },

  async addWallet(userId, guildId, amount) {
    return await db.add(`wallet_${guildId}_${userId}`, amount);
  },

  async removeWallet(userId, guildId, amount) {
    return await db.sub(`wallet_${guildId}_${userId}`, amount);
  },

  async getBank(userId, guildId) {
    return (await db.get(`bank_${guildId}_${userId}`)) || 0;
  },

  async addBank(userId, guildId, amount) {
    return await db.add(`bank_${guildId}_${userId}`, amount);
  },

  async removeBank(userId, guildId, amount) {
    return await db.sub(`bank_${guildId}_${userId}`, amount);
  },

  // 🔐 Bank Capacity System
  async getBankSpace(userId, guildId) {
    return (await db.get(`bankspace_${guildId}_${userId}`)) || 1000;
  },

  async addBankSpace(userId, guildId, amount) {
    return await db.add(`bankspace_${guildId}_${userId}`, amount);
  },

  async setBankSpace(userId, guildId, amount) {
    return await db.set(`bankspace_${guildId}_${userId}`, amount);
  },

  // 🎒 Inventory System
  async getInventory(userId, guildId) {
    return (await db.get(`inventory_${guildId}_${userId}`)) || {};
  },

  async setInventory(userId, guildId, inventory) {
    return await db.set(`inventory_${guildId}_${userId}`, inventory);
  },

  async addItem(userId, guildId, itemName, quantity = 1) {
    const inventory = await db.get(`inventory_${guildId}_${userId}`) || {};
    inventory[itemName] = (inventory[itemName] || 0) + quantity;
    return await db.set(`inventory_${guildId}_${userId}`, inventory);
  },

  async removeItem(userId, guildId, itemName, quantity = 1) {
    const inventory = await db.get(`inventory_${guildId}_${userId}`) || {};
    if (!inventory[itemName] || inventory[itemName] < quantity) return false;
    inventory[itemName] -= quantity;
    if (inventory[itemName] <= 0) delete inventory[itemName];
    await db.set(`inventory_${guildId}_${userId}`, inventory);
    return true;
  },

  async addItemToInventory(userId, guildId, itemName, quantity = 1) {
    return await this.addItem(userId, guildId, itemName, quantity);
  },

  // 🏅 Badges
  async getBadges(userId) {
    return (await db.get(`badges_${userId}`)) || [];
  },

  async addBadge(userId, badge) {
    const badges = await db.get(`badges_${userId}`) || [];
    if (!badges.includes(badge)) {
      badges.push(badge);
      await db.set(`badges_${userId}`, badges);
    }
    return badges;
  },

  // 🧠 Boosts
  async getBoosts(userId) {
    return (await db.get(`boosts_${userId}`)) || {};
  },

  async setBoost(userId, type, value) {
    const boosts = await db.get(`boosts_${userId}`) || {};
    boosts[type] = value;
    return await db.set(`boosts_${userId}`, boosts);
  },

  async addBoost(userId, type, value) {
    const boosts = await db.get(`boosts_${userId}`) || {};
    boosts[type] = (boosts[type] || 0) + value;
    return await db.set(`boosts_${userId}`, boosts);
  },

  // 🐾 Pets
  async getPets(userId) {
    return (await db.get(`pets_${userId}`)) || [];
  },

  async addPet(userId, petName) {
    const pets = await db.get(`pets_${userId}`) || [];
    if (!pets.includes(petName)) {
      pets.push(petName);
      await db.set(`pets_${userId}`, pets);
    }
    return pets;
  },

  async hasPet(userId, petName) {
    const pets = await db.get(`pets_${userId}`) || [];
    return pets.includes(petName);
  }
};

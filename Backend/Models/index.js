// ==========================================
// MODELS INDEX
// Export all models and database sync
// ==========================================

const { sequelize } = require('../database');
const User = require('./User.model');
const Category = require('./Category.model');
const Transaction = require('./Transaction.model');

// Define associations
User.hasMany(Category, { foreignKey: 'user_id' });
Category.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Transaction, { foreignKey: 'user_id' });
Transaction.belongsTo(User, { foreignKey: 'user_id' });

Category.hasMany(Transaction, { foreignKey: 'category_id' });
Transaction.belongsTo(Category, { foreignKey: 'category_id' });

// Export all models
const models = {
  User,
  Category,
  Transaction,
};

// ==========================================
// SYNC DATABASE - Create/update tables
// ==========================================
const syncDatabase = async (options = {}) => {
  try {
    await sequelize.sync(options);
    console.log('✅ Database tables synchronized');
  } catch (error) {
    console.error('❌ Error syncing database:', error);
    throw error;
  }
};

// ==========================================
// EXPORTS
// ==========================================
module.exports = {
  ...models,
  syncDatabase,
};

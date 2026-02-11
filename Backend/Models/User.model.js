// ==========================================
// USER MODEL
// Database schema for users table
// ==========================================

const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  full_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: true, // Allow null for OAuth users
  },
  profile_picture: {
    type: DataTypes.STRING(500),
    allowNull: true,
    defaultValue: null,
  },
  google_id: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['email'],
    },
  ],
});

// ==========================================
// INSTANCE METHODS
// ==========================================

// Compare password for login
User.prototype.comparePassword = async function(candidatePassword) {
  if (!this.password) {
    return false; // OAuth users don't have password
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

// Hide password in JSON responses
User.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

// ==========================================
// HOOKS
// ==========================================

// Hash password before creating user
User.beforeCreate(async (user) => {
  if (user.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// Hash password before updating if changed
User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

module.exports = User;

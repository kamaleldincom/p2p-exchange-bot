const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: String,
  referralCode: { type: String, required: true, unique: true },
  referredBy: { type: String, required: true },
  trustScore: { type: Number, default: 20 },
  status: { 
    type: String, 
    enum: ['active', 'suspended', 'banned'],
    default: 'active'
  },
  stats: {
    successfulTrades: { type: Number, default: 0 },
    totalTrades: { type: Number, default: 0 },
    referralCount: { type: Number, default: 0 },
    issuesReported: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

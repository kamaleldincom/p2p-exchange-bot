// src/services/userService.js
const User = require('../models/user');
const { generateReferralCode } = require('../utils/helpers');
const logger = require('../utils/logger');

async function registerUser(userId, username, referralCode) {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ userId: userId.toString() });
    if (existingUser) {
      return { success: false, message: 'User already registered' };
    }

    // Count total users
    const userCount = await User.countDocuments();
    
    // For first user: ignore referral code
    // For subsequent users: require valid referral code
    if (userCount > 0 && !referralCode) {
      return { success: false, message: 'Please provide a referral code' };
    }

    if (userCount > 0) {
      // Verify referral code for non-first users
      const referrer = await User.findOne({ referralCode });
      if (!referrer) {
        return { success: false, message: 'Invalid referral code' };
      }
    }

    // Create new user
    const newUser = new User({
      userId: userId.toString(), // Ensure userId is stored as string
      username: username,
      referralCode: generateReferralCode(),
      referredBy: userCount === 0 ? 'SYSTEM' : referralCode,
      trustScore: 20,
      stats: {
        successfulTrades: 0,
        totalTrades: 0,
        referralCount: 0,
        issuesReported: 0
      }
    });

    await newUser.save();
    logger.info(`New user registered: ${userId}`);

    // If there's a referrer (not first user), update their stats
    if (userCount > 0) {
      await User.findOneAndUpdate(
        { referralCode },
        { $inc: { 'stats.referralCount': 1 } }
      );
    }

    return { 
      success: true, 
      referralCode: newUser.referralCode,
      isFirstUser: userCount === 0
    };
  } catch (error) {
    logger.error('User registration error:', error);
    return { success: false, message: 'Registration failed: ' + error.message };
  }
}

module.exports = { registerUser };
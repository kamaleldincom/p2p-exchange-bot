// src/handlers/index.js
const User = require('../models/user');
const { registerUser } = require('../services/userService');
const { createTrade, completeTrade } = require('../services/tradeService');
const logger = require('../utils/logger');

const registerHandlers = (bot) => {
  // Start command - requires referral code
  bot.command('start', async (ctx) => {
    try {
      const args = ctx.message.text.split(' ');
      const referralCode = args[1];
      
      const result = await registerUser(ctx.from.id, ctx.from.username, referralCode);
      
      if (result.success) {
        let message = `🎉 Welcome to the P2P Exchange! `;
        if (result.isFirstUser) {
          message += `\n\nYou are the first user! 🥇`;
        }
        message += `\n\nYour referral code is: ${result.referralCode}`;
        message += `\n\nShare this code with others to grow your network!`;
        message += `\n\nUse /help to see available commands.`;
        return ctx.reply(message);
      } else {
        return ctx.reply('Registration failed: ' + result.message);
      }
    } catch (error) {
      logger.error('Start command error:', error);
      return ctx.reply('Sorry, something went wrong. Please try again.');
    }
  });
  

  // Get my referral code
  bot.command('myreferral', async (ctx) => {
    try {
      const user = await User.findOne({ userId: ctx.from.id });
      if (!user) {
        return ctx.reply('Please register first using /start REFERRAL_CODE');
      }
      return ctx.reply(`Your referral code is: ${user.referralCode}`);
    } catch (error) {
      logger.error('Referral code error:', error);
      return ctx.reply('Sorry, something went wrong. Please try again.');
    }
  });

  // Get trust score
  bot.command('trustscore', async (ctx) => {
    try {
      const user = await User.findOne({ userId: ctx.from.id });
      if (!user) {
        return ctx.reply('Please register first using /start REFERRAL_CODE');
      }
      
      const message = `🏆 Your Trust Score: ${user.trustScore}\n\n` +
                     `📊 Stats:\n` +
                     `✅ Successful Trades: ${user.stats.successfulTrades}\n` +
                     `🤝 Total Trades: ${user.stats.totalTrades}\n` +
                     `👥 Referrals: ${user.stats.referralCount}\n` +
                     `⚠️ Issues Reported: ${user.stats.issuesReported}`;
      
      return ctx.reply(message);
    } catch (error) {
      logger.error('Trust score error:', error);
      return ctx.reply('Sorry, something went wrong. Please try again.');
    }
  });

  // Placeholder commands - to be implemented
  bot.command('buy', (ctx) => ctx.reply('Buy command - coming soon'));
  bot.command('sell', (ctx) => ctx.reply('Sell command - coming soon'));
  bot.command('done', (ctx) => ctx.reply('Done command - coming soon'));
  bot.command('issue', (ctx) => ctx.reply('Issue command - coming soon'));

  // Help command
  bot.command('help', (ctx) => {
    const helpText = `
Available commands:
/start REFERRAL_CODE - Register with a referral code
/myreferral - Get your referral code
/trustscore - Check your trust score and stats
/buy - Create a buy request (coming soon)
/sell - Create a sell request (coming soon)
/done - Complete a trade (coming soon)
/issue - Report an issue (coming soon)
/help - Show this help message
    `;
    return ctx.reply(helpText.trim());
  });

  // Handle unknown commands
  bot.on('text', (ctx) => {
    return ctx.reply('Unknown command. Use /help to see available commands.');
  });
};

module.exports = { registerHandlers };
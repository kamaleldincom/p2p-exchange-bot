// src/index.js
require('dotenv').config();
const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const { registerHandlers } = require('./handlers');

// Initialize bot
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => logger.info('Connected to MongoDB'))
  .catch((err) => logger.error('MongoDB connection error:', err));

// Register command handlers
registerHandlers(bot);

// Start bot
bot.launch()
  .then(() => logger.info('Bot started'))
  .catch((err) => logger.error('Bot start error:', err));

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
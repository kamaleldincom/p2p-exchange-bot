// src/services/tradeService.js
const Trade = require('../models/trade');
const logger = require('../utils/logger');

async function createTrade(userId, type, params) {
  try {
    const trade = new Trade({
      tradeId: Math.random().toString(36).substring(7),
      buyerId: type === 'buy' ? userId : null,
      sellerId: type === 'sell' ? userId : null,
      details: params,
      status: 'open'
    });

    await trade.save();
    return { success: true, trade };
  } catch (error) {
    logger.error('Create trade error:', error);
    return { success: false, message: 'Failed to create trade' };
  }
}

async function completeTrade(userId, tradeId) {
  try {
    const trade = await Trade.findOne({ tradeId });
    if (!trade) {
      return { success: false, message: 'Trade not found' };
    }

    trade.status = 'completed';
    trade.outcome = 'success';
    await trade.save();

    return { success: true, trade };
  } catch (error) {
    logger.error('Complete trade error:', error);
    return { success: false, message: 'Failed to complete trade' };
  }
}

module.exports = { createTrade, completeTrade };
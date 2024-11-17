const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  tradeId: { type: String, required: true, unique: true },
  buyerId: { type: String, required: true },
  sellerId: { type: String },
  status: {
    type: String,
    enum: ['open', 'matched', 'completed', 'disputed'],
    default: 'open'
  },
  details: {
    buyCurrency: String,
    sellCurrency: String,
    amount: Number
  },
  outcome: {
    type: String,
    enum: ['success', 'issue', 'abandoned', null],
    default: null
  },
  affectedUsers: [String]
}, { timestamps: true });

module.exports = mongoose.model('Trade', tradeSchema);

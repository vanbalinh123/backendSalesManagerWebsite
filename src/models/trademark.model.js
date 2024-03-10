const mongoose = require("mongoose");

const trademarkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    min: 0,
    required: true
  },
});

const Trademark = mongoose.model('Trademark', trademarkSchema);

module.exports = Trademark;
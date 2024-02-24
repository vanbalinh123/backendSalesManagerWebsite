const mongoose = require("mongoose");

const trademarkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    require: true
  },
  quantity: {
    type: Number,
    min: 0,
    require: true
  },
});

const Trademark = mongoose.model('Trademark', trademarkSchema);

module.exports = Trademark;
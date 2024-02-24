const mongoose = require("mongoose");

const productGroupSchema = new mongoose.Schema({
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

const ProductGroup = mongoose.model('ProductGroup', productGroupSchema);

module.exports = ProductGroup;
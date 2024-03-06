const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    maxlength: 150,
    minlength: 3,
    required: true
  },
  code: {
    type: String,
    require: true
  },
  productGroup: {
    type: mongoose.Schema.ObjectId,
    ref: 'ProductGroup',
    required: true
  },
  trademark: {
    type: mongoose.Schema.ObjectId,
    ref: 'Trademark',
    required: true
  },
  quantity: {
    type: Number,
    min: 0,
    required: true
  },
  describe: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    min: 0,
    required: true
  },
  price: {
    type: Number,
    min: 0,
    required: true
  },
  // img: {
  //   public_id: {
  //     type: String,
  //     require: true
  //   },
  //   url: {
  //     type: String,
  //     require: true
  //   },
  // }
  img: {
    type: String,
    required: true,
  }
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
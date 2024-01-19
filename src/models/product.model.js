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
    minlength: 6,
    require: true
  },
  code: {
    type: String,
    require: true
  },
  // productGroups: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'ProductGroup',
  //   required: true
  // },
  // trademark: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'Trademark',
  //   required: true
  // },
  productGroups: {
    type: String,
    require: true,
  },
  trademark: {
    type: String,
    require: true,
  },
  quantity: {
    type: Number,
    min: 0,
    require: true
  },
  describe: {
    type: String,
    require: true,
  },
  cost: {
    type: String,
    require: true
  },
  price: {
    type: String,
    require: true
  },
  img: {
    type: String,
    require: true
  }
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
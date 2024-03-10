const mongoose = require("mongoose");

const ReturnSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    required: true,
  },
  day: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  totalCost: {
    type: Number,
    required: true,
  },
  productsReturned: [
    {
      code: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      cost: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
      productGroup: [
        {
          _id: {
            type: String,
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
        },
      ],
      trademark: [
        {
          _id: {
            type: String,
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
        },
      ],
    },
  ],
});

const Return = mongoose.model("Return", ReturnSchema);

module.exports = Return;

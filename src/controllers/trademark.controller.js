const Trademark = require("../models/trademark.model");
const Product = require("../models/product.model");
const { validationResult } = require("express-validator");
const catching = require("../helpers/catching");
const AppError = require("../helpers/AppError");

exports.getTrademarks = catching(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Data is not valid", 422, errors.array()));
  }

  const { name } = req.query;

  try {
    const userId = req.user._id;
    const userTrademark = await Trademark.find({ userId: userId });
    let filteredTrademark = userTrademark;

    if (name) {
      filteredTrademark = filteredTrademark.filter((group) =>
        group.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    res.json(filteredTrademark);
  } catch (error) {
    return next(new AppError("Error fetching trademark", 500, error));
  }
});

exports.addTrademark = catching(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Data is not valid", 422, errors.array()));
  }

  const { nameProductGroup: name } = req.body;
  const userId = req.user._id;

  const trademarkOfUser = await Trademark.find({
    userId: userId,
  });
  const exist = trademarkOfUser.find(
    (item) => item.name === name
  );

  if (exist === undefined) {
    const trademark = await Trademark.create({
      userId,
      name: name,
    });
    res.status(201).json({
      status: "success",
      data: {
        trademark,
      },
    });
  } else {
    res
      .status(422)
      .json({ message: "Error!!! Your Product Groups is existed!" });
    return next(
      new AppError("Your Product Groups is existed!", 422, errors.array())
    );
  }
});

exports.updateTrademark = catching(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Data is not valid", 422, errors.array()));
  }

  const { id } = req.params;
  const { name } = req.body;
  const trademark = await Trademark.findById(id);
  if (!trademark) {
    next(new AppError("Not Found!!!", 404));
    res.status(404).json({ message: "Not found!!!" });
    return;
  }

  trademark.name = name;
  await trademark.save();

  res
  .status(200)
  .json({
      status: 'success',
      data: {
        trademark
      }
  });
});


exports.deleteTrademark = catching(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Data is not valid", 422, errors.array()));
  };

  const { id } = req.params;
  const userId = req.user._id;
  const trademark = await Trademark.findById(id);

  if (!trademark) {
    return res.status(404).json({ message: "Trademark not found!" });
  }

//  await Product.updateMany(
//     { userId: userId, trademark: trademark._id },
//     { $set: { trademark: "!!!" } }
//   );


  await Trademark.findByIdAndDelete(id);
  res
  .status(204)
  .json({
      status: 'success',
      data: {
        trademark: null,
      }
  });
})
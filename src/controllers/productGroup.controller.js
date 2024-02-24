const ProductGroup = require("../models/productGroup.model");
const Product = require("../models/product.model");
const { validationResult } = require("express-validator");
const catching = require("../helpers/catching");
const AppError = require("../helpers/AppError");

exports.getProductGroups = catching(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Data is not valid", 422, errors.array()));
  }

  const { name } = req.query;

  try {
    const userId = req.user._id;
    const userProductGroups = await ProductGroup.find({ userId: userId });
    let filteredProductGroups = userProductGroups;

    if (name) {
      filteredProductGroups = filteredProductGroups.filter((group) =>
        group.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    res.json(filteredProductGroups);
  } catch (error) {
    return next(new AppError("Error fetching product groups", 500, error));
  }
});

exports.addProductGroup = catching(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Data is not valid", 422, errors.array()));
  }

  const { nameProductGroup } = req.body;
  const userId = req.user._id;

  const productGroupOfUser = await ProductGroup.find({
    userId: userId,
  });
  const exist = productGroupOfUser.find(
    (item) => item.name === nameProductGroup
  );

  if (exist === undefined) {
    const productGroup = await ProductGroup.create({
      userId,
      name: nameProductGroup,
      quantity: 0
    });
    res.status(201).json({
      status: "success",
      data: {
        productGroup,
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

exports.updateProductGroup = catching(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Data is not valid", 422, errors.array()));
  }

  const { id } = req.params;
  const { name } = req.body;
  const productGroup = await ProductGroup.findById(id);
  if (!productGroup) {
    next(new AppError("Not Found!!!", 404));
    res.status(404).json({ message: "Not found!!!" });
    return;
  }

  productGroup.name = name;
  await productGroup.save();

  res
  .status(200)
  .json({
      status: 'success',
      data: {
        productGroup
      }
  });
});


exports.deleteProductGroup = catching(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Data is not valid", 422, errors.array()));
  };

  const { id } = req.params;
  const userId = req.user._id;
  const productGroup = await ProductGroup.findById(id);
  if (!productGroup) {
    return res.status(404).json({ message: "Product Group not found!" });
  }

  // await Product.updateMany(
  //   { userId: userId, productGroup: productGroup._id },
  //   { $set: { productGroup: "!!!" } }
  // );

  await ProductGroup.findByIdAndDelete(id);
  res
  .status(204)
  .json({
      status: 'success',
      data: {
        productGroup: null,
      }
  });
})
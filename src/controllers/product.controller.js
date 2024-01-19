const Product = require("../models/product.model");
const ProductGroup = require("../models/productGroup.model");
const Trademark = require("../models/trademark.model");
const { validationResult } = require("express-validator");
const catching = require("../helpers/catching");
const AppError = require("../helpers/AppError");

exports.getProducts = catching(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Data is not valid", 422, errors.array()));
  }

  const userId = req.user._id;
  const { name, code, productGroups, trademark, page } = req.query;

  const productOfUser = await Product.find({
    userId: userId,
  });

  let filteredProducts = productOfUser;
  if (name || code) {
    filteredProducts = filteredProducts.filter(
      (item) =>
        (name && item.name.toLowerCase().includes(name.toLowerCase())) ||
        (code && item.code.toLowerCase().includes(code.toLowerCase()))
    );
  }

  if (productGroups) {
    filteredProducts = filteredProducts.filter(
      (item) => item.productGroups.toLowerCase() === productGroups.toLowerCase()
    );
  }

  if (trademark) {
    filteredProducts = filteredProducts.filter(
      (item) => item.trademark.toLowerCase() === trademark.toLowerCase()
    );
  }

  const productsPerPage = 10;
  const totalProducts = filteredProducts.length;
  const currentPage = Number(page) || 0;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const startIndex = currentPage * productsPerPage;
  const endIndex = startIndex + productsPerPage;

  const productsForPage = filteredProducts.slice(startIndex, endIndex);

  res.json({
    currentPage,
    totalPages,
    productsPerPage,
    totalProducts,
    products: productsForPage,
  });
});

exports.addProduct = catching(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Data is not valid", 422, errors.array()));
  }

  const userId = req.user._id;
  const {
    name,
    code,
    productGroups: nameProductGroup,
    trademark: nameTrademark,
    quantity,
    describe,
    cost,
    price,
    img,
  } = req.body;

  const productOfUser = await Product.find({
    userId: userId,
  });

  const exist = productOfUser.find((item) => item.code === code);

  if (exist === undefined) {
    const productGroup = await ProductGroup.findOne({
      name: nameProductGroup,
      userId: userId,
    });
    const trademark = await Trademark.findOne({
      name: nameTrademark,
      userId: userId,
    });

    if (!productGroup || !trademark) {
      return next(new AppError("ProductGroup or Trademark not found", 404));
    }
    const products = await Product.create({
      userId,
      name,
      code,
      productGroups: productGroup.name,
      trademark: trademark.name,
      quantity,
      describe,
      cost,
      price,
      img,
    });
    res.status(201).json({
      status: "success",
      data: {
        products,
      },
    });
  } else {
    res.status(422).json({ message: "Error!!! Your Product is existed!" });
    return next(new AppError("Your Product is existed!", 422, errors.array()));
  }
});

exports.updateProduct = catching(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Data is not valid", 422, errors.array()));
  }

  const userId = req.user._id;
  const { id } = req.params;
  const {
    name,
    code,
    productGroups,
    trademark,
    quantity,
    describe,
    cost,
    price,
    img,
  } = req.body;

  const existingProduct = await Product.findOne({
    userId: userId,
    _id: { $ne: id },
    code: code,
  });

  if (existingProduct) {
    res
      .status(422)
      .json({ message: "Error!!! Your Product's code is existed!" });
    return next(new AppError("Your Product's code is existed!", 422));
  }

  const productGroupFind = await ProductGroup.findOne({
    name: productGroups,
    userId: userId,
  });
  const trademarkFind = await Trademark.findOne({
    name: trademark,
    userId: userId,
  });

  if (!productGroupFind || !trademarkFind) {
    res
      .status(404)
      .json({ message: "Product Group or Trademark does not exist!" });
    return next(
      new AppError("Product Group or Trademark does not exist!", 404)
    );
  }

  const productOfUser = await Product.findOneAndUpdate(
    { userId: userId, _id: id },
    {
      name: name,
      code: code,
      productGroups: productGroups,
      trademark: trademark,
      quantity: quantity,
      describe: describe,
      cost: cost,
      price: price,
      img: img,
    },
    { new: true }
  );

  if (!productOfUser) {
    next(new AppError("Not Found!!!", 404));
    return;
  }

  res.status(200).json({
    status: "success",
    data: {
      product: productOfUser,
    },
  });
});

exports.deleteProduct = catching(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Data is not valid", 422, errors.array()));
  }

  const { id } = req.params;
  await Product.findByIdAndDelete(id);
  res.status(204).json({
    status: "success",
    data: {
      product: null,
    },
  });
});

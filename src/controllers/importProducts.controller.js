const Import = require("../models/importProduct.model");
const Product = require("../models/product.model");
const ProductGroup = require("../models/productGroup.model");
const Trademark = require("../models/trademark.model");
const { validationResult } = require("express-validator");
const catching = require("../helpers/catching");
const AppError = require("../helpers/AppError");

exports.getImports = catching(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Data is not valid", 422, errors.array()));
  }

  const { code, page, dateBefore, dateAfter } = req.query;

  const userId = req.user._id;
  let query = { userId: userId };

  const dateBeforeObj = new Date(dateBefore);
  const dateAfterObj = new Date(dateAfter);

  const dateBeforeSearch = {
    day: dateBeforeObj.getDate(),
    month: dateBeforeObj.getMonth() + 1,
    year: dateBeforeObj.getFullYear(),
  };

  const dateAfterSearch = {
    day: dateAfterObj.getDate(),
    month: dateAfterObj.getMonth() + 1,
    year: dateAfterObj.getFullYear(),
  };

  if (code) {
    query.code = { $regex: new RegExp(code, "i") };
  }

  if(dateBefore && dateAfter) {
    query.day ={ $gte: dateBeforeSearch.day, $lte: dateAfterSearch.day }
    query.month = { $gte: dateBeforeSearch.month, $lte: dateAfterSearch.month },
    query.year = { $gte: dateBeforeSearch.year, $lte: dateAfterSearch.year }
  }

  if(dateBefore && !dateAfter) {
    query.day = dateBeforeSearch.day,
    query.month = dateBeforeSearch.month,
    query.year = dateBeforeSearch.year
  }

  if(!dateBefore && dateAfter) {
    query.day = dateAfterSearch.day,
    query.month = dateAfterSearch.month,
    query.year = dateAfterSearch.year
  }

  const importPerPage = 10;
  const currentPage = Number(page) || 0;
  const totalImported = await Import.countDocuments(query);
  const totalPages = Math.ceil(totalImported / importPerPage);

  const imported = await Import.find(query)
    .limit(importPerPage)
    .skip(currentPage * importPerPage)
    .exec();

  res.json({
    import: imported,
    currentPage,
    totalPages,
    importPerPage,
    totalImported,
  });
});

exports.addImport = catching(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Data is not valid", 422, errors.array()));
  }

  const userId = req.user._id;
  const { status, code, note, day, month, year, totalCost, productsImported } =
    req.body;

  const importOfUser = await Import.findOne({
    userId: userId,
    code: code,
  });

  if (!importOfUser) {
    const newImport = await Import.create({
      userId: userId,
      status: status,
      code: code,
      note: note,
      day: day,
      month: month,
      year: year,
      totalCost: totalCost,
      productsImported: productsImported,
    });

    await Promise.all(productsImported.map(async (item) => {
      await Promise.all([
        Product.findOneAndUpdate(
          { userId: userId, code: item.code },
          { $inc: { quantity: item.quantity } },
          { new: true }
        ),
        ProductGroup.findOneAndUpdate(
          { userId: userId, _id: item.productGroup._id },
          { $inc: { quantity: item.quantity } },
          { new: true }
        ),
        Trademark.findOneAndUpdate(
          { userId: userId, _id: item.trademark._id },
          { $inc: { quantity: item.quantity } },
          { new: true }
        )
      ]);
    }));
    
 
    res.status(201).json({
      status: "success",
      data: {
        imported: newImport,
      },
    });
  } else {
    res.status(422).json({ message: "Error!!! Your Import Code is existed!" });
  }
});

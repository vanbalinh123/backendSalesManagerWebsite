const Return = require("../models/returnProduct.model");
const Import = require("../models/importProduct.model");
const Product = require("../models/product.model");
const ProductGroup = require("../models/productGroup.model");
const Trademark = require("../models/trademark.model");
const { validationResult } = require("express-validator");
const catching = require("../helpers/catching");
const AppError = require("../helpers/AppError");

exports.getReturns = catching(async (req, res, next) => {
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

  if (dateBefore && dateAfter) {
    query.day = { $gte: dateBeforeSearch.day, $lte: dateAfterSearch.day };
    (query.month = {
      $gte: dateBeforeSearch.month,
      $lte: dateAfterSearch.month,
    }),
      (query.year = {
        $gte: dateBeforeSearch.year,
        $lte: dateAfterSearch.year,
      });
  }

  if (dateBefore && !dateAfter) {
    (query.day = dateBeforeSearch.day),
      (query.month = dateBeforeSearch.month),
      (query.year = dateBeforeSearch.year);
  }

  if (!dateBefore && dateAfter) {
    (query.day = dateAfterSearch.day),
      (query.month = dateAfterSearch.month),
      (query.year = dateAfterSearch.year);
  }

  const returnPerPage = 10;
  const currentPage = Number(page) || 0;
  const totalReturned = await Return.countDocuments(query);
  const totalPages = Math.ceil(totalReturned / returnPerPage);

  const returned = await Return.find(query)
    .limit(returnPerPage)
    .skip(currentPage * returnPerPage)
    .exec();

  const importedCoupon = await Import.find({
      userId: userId,
    });

  res.json({
    return: returned,
    currentPage,
    totalPages,
    returnPerPage,
    totalReturned,
    import: importedCoupon
  });
});

exports.addReturn = catching(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Data is not valid", 422, errors.array()));
  }

  const userId = req.user._id;
  const {
    codeImported,
    status,
    code,
    note,
    day,
    month,
    year,
    totalCost,
    productsReturned,
  } = req.body;

  if(!code) {
    return res.status(400).json({
      status: "fail",
      data: {
        message: "Code cannot be blank",
      },
    });
  };

  if(!note) {
    return res.status(400).json({
      status: "fail",
      data: {
        message: "Note cannot be blank",
      },
    });
  }


  const returnOfUser = await Return.findOne({
    userId: userId,
    code: code,
  });

  const importedCoupon = await Import.findOne({
    userId: userId,
    code: codeImported,
  });

  let hasError = false;

  productsReturned.forEach((returnedItem) => {
    const importedItem = importedCoupon.productsImported.find(
      (item) => item.code === returnedItem.code
    );

    if (importedItem) {
      if (importedItem.currentQuantity < returnedItem.quantity) {
        hasError = true;
      } else {
        importedItem.currentQuantity -= returnedItem.quantity;
      }
    }
  });

  if (hasError) { 
    return res.status(400).json({
      status: "fail",
      data: {
        message: "The quantity of goods to be returned has exceeded the current quantity of goods!",
      },
    });
  }

  await importedCoupon.save();

  const updatedImport = await Import.findOne({ userId: userId, code: codeImported });

  if (!returnOfUser) {
    const newReturn = await Return.create({
      userId: userId,
      status: status,
      code: code,
      note: note,
      day: day,
      month: month,
      year: year,
      totalCost: totalCost,
      productsReturned: productsReturned,
    });

    await Promise.all(
      productsReturned.map(async (item) => {
        await Promise.all([
          Product.findOneAndUpdate(
            { userId: userId, code: item.code },
            { $inc: { quantity: - Number(item.quantity) } },
            { new: true }
          ),
          ProductGroup.findOneAndUpdate(
            { userId: userId, _id: item.productGroup[0]._id },
            { $inc: { quantity: - Number(item.quantity) } },
            { new: true }
          ),
          Trademark.findOneAndUpdate(
            { userId: userId, _id: item.trademark[0]._id },
            { $inc: { quantity: - Number(item.quantity) } },
            { new: true }
          ),
        ]);
      })
    );

    res.status(201).json({
      status: "success",
      data: {
        returned: newReturn,
        imported: updatedImport
      },
    });
  } else {
    res.status(422).json({ message: "Error!!! Your Return Code is existed!" });
  }
});

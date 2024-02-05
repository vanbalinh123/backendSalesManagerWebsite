const Product = require("../models/product.model");
const ProductGroup = require("../models/productGroup.model");
const Trademark = require("../models/trademark.model");
const { validationResult } = require("express-validator");
const catching = require("../helpers/catching");
const AppError = require("../helpers/AppError");
const { v4 } = require('uuid');
const sharp = require('sharp');
const cloudinary = require("../configs/cloudinary");
const multer = require('multer');

const multerStorage = multer.diskStorage({
  destination: (req,file,cb) => {
      cb(null, 'public/img');
  },
  filename: (req,file,cb) => {
      const ext = file.mimetype.split('/')[1];
      cb(null,`product-${req.user._id}-${v4()}.${ext}`);
  }
});

const multerFilter = (req,file,cb) => {
  const {mimetype} = file;
  if(mimetype.startsWith('image')) {
      return cb(null,true);
  }
  cb(new AppError('Not an image!!!',422),false)
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadImage = upload.fields([
  {name: 'img', maxCount: 1},
]);

exports.resizeImage = catching(async(req,res,next) => {
  const {
      files,
      body
  } = req;
  if(!files.img) {
      return next();
  }
  if(files.img) {
      const image = files.img[0];
      console.log(image)
      const resizeName = `resize-${image.filename}`;
      await sharp(image.path)
          .resize(500)
          .toFile(`public/img/${resizeName}`);
      body.img = resizeName;
  }
  next();
});

exports.getProducts = catching(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Data is not valid", 422, errors.array()));
  }

  const userId = req.user._id;
  const { name, code, page, productGroups, trademark } = req.query;

  let query = { userId: userId };

  if (name) {
    query.name = { $regex: new RegExp(name, 'i') };
  }

  if (code) {
    query.code = { $regex: new RegExp(code, 'i') };
  }

  const productGroupFind = await ProductGroup.findOne({
    name: productGroups,
    userId: userId,
  });

  const trademarkFind = await Trademark.findOne({
    name: trademark,
    userId: userId,
  });

  if (productGroups) {
    query.productGroup = productGroupFind; 
  }

  if (trademark) {
    query.trademark = trademarkFind; 
  }

  const productsPerPage = 10;
  const currentPage = Number(page) || 0;

  const products = await Product.find(query)
    .populate('productGroup', 'name')
    .populate('trademark', 'name')
    .limit(productsPerPage)
    .skip(currentPage * productsPerPage)
    .exec();

  const totalProducts = await Product.countDocuments(query);
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  res.json({
    currentPage,
    totalPages,
    productsPerPage,
    totalProducts,
    products,
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
    productGroups: idProductGroup,
    trademark: idTrademark,
    quantity,
    describe,
    cost,
    price,
    img,
  } = req.body;

  const productOfUser = await Product.findOne({
    userId: userId,
    code: code
  });

  if (!productOfUser) {
    const productGroup = await ProductGroup.findOne({
      _id: idProductGroup,
      userId: userId,
    });
    const trademark = await Trademark.findOne({
      _id: idTrademark,
      userId: userId,
    });

    if (!productGroup || !trademark) {
      return next(new AppError("ProductGroup or Trademark not found", 404));
    }

    // const result = await cloudinary.uploader.upload(img, {
    //   folder: 'products'
    // })


    const products = await Product.create({
      userId,
      name,
      code,
      productGroup: idProductGroup,
      trademark: idTrademark,
      quantity,
      describe,
      cost,
      price,
      // img: {
      //   public_id: result.public_id,
      //   url: result.secure_url
      // },
      img
    });

    const newRes = products;
    newRes.productGroup = productGroup;
    newRes.trademark = trademark;

    res.status(201).json({
      status: "success",
      data: {
        products: newRes,
      },
    });
  } else {
    res.status(422).json({ message: "Error!!! Your Product is existed!" });
    // return next(new AppError("Your Product is existed!", 422, errors.array()));
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
    productGroups: idProductGroup,
    trademark: idTrademark,
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

  console.log('dasfyjkasgfas', img)

  if (existingProduct) {
    res
      .status(422)
      .json({ message: "Error!!! Your Product's code is existed!" });
    return next(new AppError("Your Product's code is existed!", 422));
  }

  const productGroupFind = await ProductGroup.findOne({
    _id: idProductGroup,
    userId: userId,
  });
  const trademarkFind = await Trademark.findOne({
    _id: idTrademark,
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
      productGroup: productGroupFind._id,
      trademark: trademarkFind._id,
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
  };

  const productGroup = await ProductGroup.findOne({
    _id: idProductGroup,
    userId: userId,
  });
  const trademark = await Trademark.findOne({
    _id: idTrademark,
    userId: userId,
  });

  const newRes = productOfUser;
  newRes.productGroup = productGroup;
  newRes.trademark = trademark;


  res.status(200).json({
    status: "success",
    data: {
      product: newRes,
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

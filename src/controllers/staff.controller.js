const Staff = require("../models/staff.model");
const { validationResult } = require("express-validator");
const catching = require("../helpers/catching");
const AppError = require("../helpers/AppError");
const { v4 } = require("uuid");
const sharp = require("sharp");
const multer = require("multer");
const { ObjectId } = require('mongoose').Types;

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `staff-${req.user._id}-${v4()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  const { mimetype } = file;
  if (mimetype.startsWith("image")) {
    return cb(null, true);
  }
  cb(new AppError("Not an image!!!", 422), false);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadAvatar = upload.fields([{ name: "avatar", maxCount: 1 }]);

exports.resizeAvatar = catching(async (req, res, next) => {
  const { files, body } = req;
  if (!files.avatar) {
    return next();
  }
  if (files.avatar) {
    const image = files.avatar[0];
    const resizeName = `resize-${image.filename}`;
    await sharp(image.path).resize(500).toFile(`public/img/${resizeName}`);
    body.avatar = resizeName;
  }
  next();
});

exports.addStaff = catching(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Data is not valid", 422, errors.array()));
  }

  const userId = req.user._id;
  const {
    nameStaff,
    position,
    workingTime,
    salary,
    avatar,
    phone,
    address,
    sex,
  } = req.body;

  const staff = await Staff.create({
    userId,
    name: nameStaff,
    codeStaff: 'ST' + v4(),
    position,
    workingTime,
    salary,
    avatar,
    phone,
    address,
    sex,
  });

  res.status(201).json({
    status: "success",
    data: {
      staff,
    },
  });
});

exports.getStaffs = catching(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Data is not valid", 422, errors.array()));
  }

  const { codeStaff, nameStaff, phone, page } = req.query;

  console.log(req.query)
  const userId = req.user._id;
  let query = { userId: userId };
  console.log(userId)

  if (codeStaff) {
    query.codeStaff = { $regex: new RegExp(codeStaff, "i") };
  }

  if (nameStaff) {
    query.name = { $regex: new RegExp(nameStaff, "i") };
  }

  if (phone) {
    query.phone = { $regex: new RegExp(phone, "i") };
  }


  const staffsPerPage = 10;
  const currentPage = Number(page) || 0;

  const staffs = await Staff.find(query)
    .limit(staffsPerPage)
    .skip(currentPage * staffsPerPage)
    .exec();

  console.log(staffs)

  const totalStaffs = await Staff.countDocuments(query);
  const totalPages = Math.ceil(totalStaffs / staffsPerPage);

  res.json({
    currentPage,
    totalPages,
    staffsPerPage,
    totalStaffs,
    staffs,
  });
});

exports.deleteStaff = catching(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Data is not valid", 422, errors.array()));
  };

  const { id } = req.params;
  await Staff.findByIdAndDelete(id);
  res.status(204).json({
    status: "success",
    data: {
      staff: null,
    },
  });
});

exports.updateStaff = catching(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Data is not valid", 422, errors.array()));
  }

  const userId = req.user._id;
  const { id } = req.params;

  const {
    nameStaff,
    position,
    workingTime,
    salary,
    avatar,
    phone,
    address,
    sex,
  } = req.body;

  const staffUpdate = await Staff.findOneAndUpdate(
    { userId: userId, _id: id },
    {
    name: nameStaff,
    position: position,
    workingTime: workingTime,
    salary: salary,
    avatar: avatar,
    phone: phone,
    address: address,
    sex: sex,
    },
    { new: true }
  );

  if (!staffUpdate) {
    next(new AppError("Not Found!!!", 404));
    return;
  };

  res.status(200).json({
    status: "success",
    data: {
      staff: staffUpdate,
    },
  });
})
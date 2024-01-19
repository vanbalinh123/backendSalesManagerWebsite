const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const catching = require("../helpers/catching");
const AppError = require("../helpers/AppError");

const User = require("../models/user.model");

exports.register = catching(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new AppError("Data is not valid", 422, errors.array()));
    return;
  }

  const { username, email, password } = req.body;
  

  const hashesPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    username,
    email,
    password: hashesPassword,
  });
  user.password = undefined;

  res.status(201).json({
    stastus: "success",
    data: {
      user,
    },
  });
});

exports.login = catching(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new AppError("Data is not valid", 422, errors.array()));
    return;
  }
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    next(new AppError("Email or password is incorrect", 401));
    return;
  }

  const isCorrectPassword = await bcrypt.compare(password, user.password);

  if (!isCorrectPassword) {
    next(new AppError("Email or password is incorrect", 401));
    return;
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  const idUser = user._id;

  res
    .status(200)
    .cookie("token", token, {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
    })
    .json({
      status: "success",
      data: {
        token,
        idUser
      },
    });
});

// exports.userLogin = catching(async (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     next(new AppError("Data is not valid", 422, errors.array()));
//     return;
//   }

//   const userId = req.user._id;
//   const user = await User.findById(userId);
//   if (!user) {
//     return next(new AppError('User not found', 404));
//   }
//   user.password = undefined;
//   res.status(200).json({
//     status: 'success',
//     data: {
//       user,
//     },
//   });
// });

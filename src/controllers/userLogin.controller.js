const { validationResult } = require("express-validator");
const catching = require("../helpers/catching");
const AppError = require("../helpers/AppError");

const User = require("../models/user.model");


exports.userLogin = catching(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new AppError("Data is not valid", 422, errors.array()));
    return;
  }

  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  user.password = undefined;
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
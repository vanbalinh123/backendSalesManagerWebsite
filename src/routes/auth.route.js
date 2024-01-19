const express = require('express');
const { body } = require('express-validator');

const router = express.Router();
const User = require('../models/user.model');
const authController = require('../controllers/auth.controller');
// const authenticateJWT = require('../middlewares/authenticateJWT')

// router.use(authenticateJWT);

router.post(
  '/register',
  [
    body('email').isEmail().custom(
      async (value, {req}) => {
        const user = await User.findOne({email: value});
        if(user) {
          throw new Error('Email has Existed');
        }
        return true;
      }
    ),
    body('password').isLength({min: 6}),
    body('confirm').custom(
      (value, {req}) => {
        if(value !== req.body.password) {
          throw new Error('Confirm password has not matched!');
        };
        return true;
      }
    )
  ],
  authController.register
);

router.post(
  '/login',
  [
      body('email').isEmail(),
      body('password').isLength({min:6})
  ],
  authController.login
);

// router.get('/userLogin', authController.userLogin);

module.exports = router;
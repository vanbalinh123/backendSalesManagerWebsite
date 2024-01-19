const express = require("express");

const router = express.Router();
const userLoginController = require("../controllers/userLogin.controller");
const authenticateJWT = require('../middlewares/authenticateJWT');

router.use(authenticateJWT);

router
  .route('/')
  .get(userLoginController.userLogin)

module.exports = router;
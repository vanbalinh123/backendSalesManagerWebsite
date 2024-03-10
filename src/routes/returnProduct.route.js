const express = require("express");

const router = express.Router();
const returnController = require("../controllers/returnProducts.controller");
const authenticateJWT = require("../middlewares/authenticateJWT");

router.use(authenticateJWT);

router
  .route('/')
  .get(returnController.getReturns)
  .post(returnController.addReturn)


module.exports = router;
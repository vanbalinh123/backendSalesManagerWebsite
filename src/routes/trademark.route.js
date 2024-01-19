const express = require("express");

const router = express.Router();
const trademarkController = require("../controllers/trademark.controller");
const authenticateJWT = require('../middlewares/authenticateJWT');

router.use(authenticateJWT);

router 
  .route('/')
  .get(trademarkController.getTrademarks)
  .post(trademarkController.addTrademark)

router
  .route('/:id')
  .patch(trademarkController.updateTrademark)
  .delete(trademarkController.deleteTrademark)
module.exports = router;
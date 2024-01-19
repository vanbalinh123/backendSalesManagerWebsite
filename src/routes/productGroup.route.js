const express = require("express");

const router = express.Router();
const productGroupController = require("../controllers/productGroup.controller");
const authenticateJWT = require('../middlewares/authenticateJWT');

router.use(authenticateJWT);

router 
  .route('/')
  .get(productGroupController.getProductGroups)
  .post(productGroupController.addProductGroup)

router
  .route('/:id')
  .patch(productGroupController.updateProductGroup)
  .delete(productGroupController.deleteProductGroup)
module.exports = router;
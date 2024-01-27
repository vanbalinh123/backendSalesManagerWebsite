const express = require("express");

const router = express.Router();
const productController = require("../controllers/product.controller");
const authenticateJWT = require('../middlewares/authenticateJWT');

router.use(authenticateJWT);
const multer = require('multer');

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

router 
  .route('/')
  .get(productController.getProducts)
  .post(productController.addProduct)

router
  .route('/:id')
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct)
module.exports = router;
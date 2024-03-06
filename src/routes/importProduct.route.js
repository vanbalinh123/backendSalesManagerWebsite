const express = require("express");

const router = express.Router();
const importController = require("../controllers/importProducts.controller");
const authenticateJWT = require("../middlewares/authenticateJWT");

router.use(authenticateJWT);

router
  .route('/')
  .get(importController.getImports)
  .post(importController.addImport)


module.exports = router;
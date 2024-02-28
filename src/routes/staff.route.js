const express = require("express");

const router = express.Router();
const staffController = require("../controllers/staff.controller");
const authenticateJWT = require("../middlewares/authenticateJWT");

router.use(authenticateJWT);

router 
  .route('/')
  .get(staffController.getStaffs)
  .post(
    staffController.uploadAvatar,
    staffController.resizeAvatar,
    staffController.addStaff
  )

router
  .route('/:id')
  .patch(
    staffController.uploadAvatar,
    staffController.resizeAvatar,
    staffController.updateStaff
  )
  .delete(staffController.deleteStaff)

module.exports = router;
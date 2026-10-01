const express = require("express");

const userController = require("../controllers/userController");

const router = express.Router();

const jwtMiddleware = require("../middlewares/jwtMiddleware");
const multerMiddleware = require("../middlewares/multerMiddleware");

// ==================== REGISTER ====================

router.post("/register", userController.userRegister);

// ==================== LOGIN ====================

router.post("/login", userController.userLogin);
router.post("/google-auth", userController.googleLogin);

// ==================== PROFILE ====================

router.put(
  "/profile-edit",
  jwtMiddleware,
  multerMiddleware.single("profileImage"),
  userController.profileEdit,
);

module.exports = router;

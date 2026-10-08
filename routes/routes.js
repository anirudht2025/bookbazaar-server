const express = require("express");

const userController = require("../controllers/userController");
const bookController = require("../controllers/bookController");

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

// ==================== BOOK ====================

router.post(
  "/add-book",
  jwtMiddleware,
  multerMiddleware.array("uploadedImages"),
  bookController.addBook,
);

// ====================      ====================

module.exports = router;

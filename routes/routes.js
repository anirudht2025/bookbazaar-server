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

// ============== AUTHENTICATED USERS ==============

// ==================== PROFILE ====================

router.put(
  "/profile-edit",
  jwtMiddleware,
  multerMiddleware.single("profileImage"),
  userController.profileEdit,
);

// ==================== BOOK ====================

router.post(
  "/books",
  jwtMiddleware,
  multerMiddleware.array("uploadedImages", 3),
  bookController.addBook,
);

// ==================== LATEST BOOKS ====================

router.get("/latest-books", jwtMiddleware, bookController.latestBooks);

module.exports = router;

const express = require("express");

const userController = require("../controllers/userController");
const bookController = require("../controllers/bookController");

const router = express.Router();

const jwtMiddleware = require("../middlewares/jwtMiddleware");
const multerMiddleware = require("../middlewares/multerMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

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

// ==================== BOOK LIST (EXCLUDING LOGGED-IN SELLER) ====================

router.get("/booklist", jwtMiddleware, bookController.bookList);

// ==================== USER ADDED BOOKS ====================

router.get("/user-books", jwtMiddleware, bookController.userAddedBook);

// ==================== DELETE BOOK ADDED BY USER ====================

router.delete(
  "/delete-book/:bid",
  jwtMiddleware,
  bookController.deleteAddedBook,
);

// ==================== PURCHASED BOOKS BY LOGGED IN USER ====================

router.get("/purchased-books", jwtMiddleware, bookController.purchasedBookList);

// ==================== VIEW BOOK DETAILS ====================

router.get("/books/:bid", jwtMiddleware, bookController.getBookById);

// ==================== BOOK PAYMENT ====================

router.get("/payment/:bid", jwtMiddleware, bookController.bookPayment);

// ====================  ====================  ====================

// ==================== ADMIN USER ROUTES ====================

// Get all books for admin
router.get("/admin/allBooks", adminMiddleware, bookController.getAdminAllBooks);

// Approve a book (admin)
router.get("/admin/approve/:bid", adminMiddleware, bookController.approveBook);

// ====================  ====================  ====================

module.exports = router;

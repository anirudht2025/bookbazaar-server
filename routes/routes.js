const express = require("express");

const userController = require("../controllers/userController");

const router = express.Router();

// ==================== REGISTER ====================

router.post("/register", userController.userRegister);

// ==================== LOGIN ====================

router.post("/login", userController.userLogin);

// ==================== PROFILE ====================

router.get("/profile", userController.userProfile);

module.exports = router;

const express = require("express");

const userController = require("../controllers/userController");

const router = express.Router();

const jwtMiddleware = require("../middlewares/jwtMiddleware");

// ==================== REGISTER ====================

router.post("/register", userController.userRegister);

// ==================== LOGIN ====================

router.post("/login", userController.userLogin);

// ==================== PROFILE ====================

router.get("/profile", jwtMiddleware, userController.userProfile);

module.exports = router;

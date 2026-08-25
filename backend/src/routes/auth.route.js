const express = require("express");

const router = express.Router();

const authController =
    require("../controllers/auth.controller");

const {
    authenticate
} = require("../middlewares/auth.middleware");


// ==========================================================
// REGISTER
// POST /api/auth/register
// ==========================================================

router.post(
    "/register",
    authController.register
);


// ==========================================================
// LOGIN
// POST /api/auth/login
// ==========================================================

router.post(
    "/login",
    authController.login
);


// ==========================================================
// GET PROFILE
// GET /api/auth/profile
// ==========================================================

router.get(
    "/profile",
    authenticate,
    authController.profile
);


// ==========================================================
// UPDATE PROFILE
// PUT /api/auth/profile
// ==========================================================

router.put(
    "/profile",
    authenticate,
    authController.updateProfile
);


module.exports = router;
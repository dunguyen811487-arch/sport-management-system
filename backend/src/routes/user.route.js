const express = require("express");

const router = express.Router();

const userController =
    require("../controllers/user.controller");

const {
    authenticate,
    authorize
} = require("../middlewares/auth.middleware");


// ==========================================================
// GET ALL USERS
// ==========================================================

router.get(
    "/",
    authenticate,
    authorize("admin"),
    userController.getAllUsers
);


// ==========================================================
// CREATE STAFF
// ==========================================================

router.post(
    "/staff",
    authenticate,
    authorize("admin"),
    userController.createStaff
);


// ==========================================================
// DELETE USER
// ==========================================================

router.delete(
    "/:id",
    authenticate,
    authorize("admin"),
    userController.deleteUser
);


module.exports = router;
const express = require("express");

const {
    createField,
    getAllFields,
    getFieldById,
    updateField,
    deleteField
} = require("../controllers/field.controller");

const upload =
    require("../middlewares/upload");

const {
    authenticate,
    authorize
} = require("../middlewares/auth.middleware");

const router = express.Router();


// ======================================================
// PUBLIC / CUSTOMER / STAFF / ADMIN
// ======================================================

// Lấy danh sách sân
router.get(
    "/",
    getAllFields
);


// Lấy chi tiết sân
router.get(
    "/:id",
    getFieldById
);


// ======================================================
// STAFF + ADMIN
// ======================================================

// Tạo sân
router.post(
    "/",
    authenticate,
    authorize(
        "staff",
        "admin"
    ),
    upload.single("image"),
    createField
);


// Cập nhật sân
router.put(
    "/:id",
    authenticate,
    authorize(
        "staff",
        "admin"
    ),
    upload.single("image"),
    updateField
);


// ======================================================
// ADMIN
// ======================================================

// Xóa sân
//
// Mình giữ quyền xóa chỉ cho Admin để Staff
// không thể xóa nhầm dữ liệu sân.
//
router.delete(
    "/:id",
    authenticate,
    authorize("admin"),
    deleteField
);


module.exports = router;
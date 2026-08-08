const express = require("express");

const router = express.Router();

const paymentController = require(
    "../controllers/payment.controller"
);

const {
    authenticate,
    authorize
} = require("../middlewares/auth.middleware");


// ======================================================
// CUSTOMER
// ======================================================

// Tạo payment
router.post(
    "/",
    authenticate,
    authorize("customer"),
    paymentController.createPayment
);


// Xem payment của mình
router.get(
    "/my",
    authenticate,
    authorize("customer"),
    paymentController.getMyPayments
);


// ======================================================
// ADMIN
// ======================================================

// Xem tất cả payment
router.get(
    "/",
    authenticate,
    authorize("admin"),
    paymentController.getAllPayments
);


// Xác nhận / cập nhật payment
router.put(
    "/:id",
    authenticate,
    authorize("admin"),
    paymentController.updatePayment
);


// Xóa payment
router.delete(
    "/:id",
    authenticate,
    authorize("admin"),
    paymentController.deletePayment
);


// ======================================================
// CUSTOMER + ADMIN
// ======================================================

// Xem payment theo ID
router.get(
    "/:id",
    authenticate,
    authorize("customer", "admin"),
    paymentController.getPaymentById
);


module.exports = router;
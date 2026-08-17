const express =
    require("express");

const router =
    express.Router();


const paymentController =
    require(
        "../controllers/payment.controller"
    );


const {
    authenticate,
    authorize
} = require(
    "../middlewares/auth.middleware"
);


// ======================================================
// UPLOAD
// ======================================================

const upload =
    require(
        "../middlewares/upload"
    );


// ======================================================
// CUSTOMER
// ======================================================


// ------------------------------------------------------
// CREATE PAYMENT
//
// cash:
// không cần file
//
// bank_transfer:
// cần paymentProof
// ------------------------------------------------------

router.post(
    "/",
    authenticate,
    authorize("customer"),
    upload.single("paymentProof"),
    paymentController.createPayment
);


// ------------------------------------------------------
// MY PAYMENTS
// ------------------------------------------------------

router.get(
    "/my",
    authenticate,
    authorize("customer"),
    paymentController.getMyPayments
);


// ======================================================
// STAFF + ADMIN
// ======================================================


// ------------------------------------------------------
// GET ALL
// ------------------------------------------------------

router.get(
    "/",
    authenticate,
    authorize(
        "staff",
        "admin"
    ),
    paymentController.getAllPayments
);


// ------------------------------------------------------
// UPDATE
// ------------------------------------------------------

router.put(
    "/:id",
    authenticate,
    authorize(
        "staff",
        "admin"
    ),
    paymentController.updatePayment
);


// ======================================================
// ADMIN
// ======================================================


// ------------------------------------------------------
// DELETE
// ------------------------------------------------------

router.delete(
    "/:id",
    authenticate,
    authorize("admin"),
    paymentController.deletePayment
);


// ======================================================
// CUSTOMER + STAFF + ADMIN
// ======================================================


// ------------------------------------------------------
// GET BY ID
// ------------------------------------------------------

router.get(
    "/:id",
    authenticate,
    authorize(
        "customer",
        "staff",
        "admin"
    ),
    paymentController.getPaymentById
);


module.exports = router;
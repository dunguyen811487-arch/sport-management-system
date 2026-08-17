const express = require("express");

const router = express.Router();

const bookingController =
    require("../controllers/booking.controller");

const {
    authenticate,
    authorize
} =
    require("../middlewares/auth.middleware");


// ======================================================
// CUSTOMER
// ======================================================

// Tạo booking
router.post(
    "/",
    authenticate,
    authorize("customer"),
    bookingController.createBooking
);


// Xem booking của mình
router.get(
    "/my",
    authenticate,
    authorize("customer"),
    bookingController.getMyBookings
);

// ======================================================
// AVAILABILITY
// ======================================================

router.get(
    "/availability",
    authenticate,
    authorize(
        "customer",
        "staff",
        "admin"
    ),
    bookingController.getBookedSlots
);
// ======================================================
// STAFF + ADMIN
// ======================================================

// Xem tất cả booking
router.get(
    "/",
    authenticate,
    authorize("staff", "admin"),
    bookingController.getAllBookings
);


// ======================================================
// CUSTOMER + STAFF + ADMIN
// ======================================================

// Xem booking theo ID
//
// Customer:
// → chỉ được xem booking của chính mình
//
// Staff/Admin:
// → được xem booking
//
router.get(
    "/:id",
    authenticate,
    authorize(
        "customer",
        "staff",
        "admin"
    ),
    bookingController.getBookingById
);


// ======================================================
// STAFF + ADMIN
// ======================================================

// Cập nhật booking
router.put(
    "/:id",
    authenticate,
    authorize("staff", "admin"),
    bookingController.updateBooking
);


// ======================================================
// CUSTOMER + STAFF + ADMIN
// ======================================================

// Hủy booking
router.put(
    "/:id/cancel",
    authenticate,
    authorize(
        "customer",
        "staff",
        "admin"
    ),
    bookingController.cancelBooking
);


// ======================================================
// ADMIN
// ======================================================

// Xóa booking
router.delete(
    "/:id",
    authenticate,
    authorize("admin"),
    bookingController.deleteBooking
);


module.exports = router;
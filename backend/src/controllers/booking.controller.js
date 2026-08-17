const bookingService = require("../services/booking.service");

// ======================================================
// CREATE BOOKING - CUSTOMER
// ======================================================

const createBooking = async (req, res) => {
    try {
        const bookingData = {
            ...req.body,

            // Không lấy customerId từ Body
            // Lấy trực tiếp từ JWT
            customerId: req.user.id
        };

        const booking =
            await bookingService.createBooking(bookingData);

        res.status(201).json({
            success: true,
            message: "Tạo booking thành công",
            data: booking
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// GET ALL BOOKINGS - STAFF + ADMIN
// ======================================================

const getAllBookings = async (req, res) => {
    try {
        const bookings =
            await bookingService.getAllBookings();

        res.json({
            success: true,
            data: bookings
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// GET MY BOOKINGS - CUSTOMER
// ======================================================

const getMyBookings = async (req, res) => {
    try {
        const bookings =
            await bookingService.getBookingsByCustomer(
                req.user.id
            );

        res.json({
            success: true,
            data: bookings
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// GET BOOKING BY ID
// CUSTOMER + STAFF + ADMIN
// ======================================================

const getBookingById = async (req, res) => {
    try {
        const booking =
            await bookingService.getBookingById(
                req.params.id
            );

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy booking"
            });
        }


        // --------------------------------------------------
        // CUSTOMER
        // Chỉ được xem booking của chính mình
        // --------------------------------------------------

        if (req.user.role === "customer") {

            if (!booking.customerId) {
                return res.status(403).json({
                    success: false,
                    message: "Booking không có thông tin customer"
                });
            }

            const customerId =
                booking.customerId._id
                    ? booking.customerId._id.toString()
                    : booking.customerId.toString();

            if (customerId !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message:
                        "Bạn không có quyền xem booking này"
                });
            }
        }


        // --------------------------------------------------
        // STAFF + ADMIN
        // Được xem booking
        // --------------------------------------------------

        res.json({
            success: true,
            data: booking
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// UPDATE BOOKING - STAFF + ADMIN
// ======================================================

const updateBooking = async (req, res) => {
    try {

        // Không cho sửa customerId
        // Customer của booking phải được giữ nguyên
        const updateData = {
            ...req.body
        };

        delete updateData.customerId;

        const booking =
            await bookingService.updateBooking(
                req.params.id,
                updateData
            );

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy booking"
            });
        }

        res.json({
            success: true,
            message: "Cập nhật booking thành công",
            data: booking
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// CANCEL BOOKING
// CUSTOMER + STAFF + ADMIN
// ======================================================

const cancelBooking = async (req, res) => {
    try {

        const booking =
            await bookingService.getBookingById(
                req.params.id
            );

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy booking"
            });
        }


        // --------------------------------------------------
        // CUSTOMER
        // Chỉ được hủy booking của chính mình
        // --------------------------------------------------

        if (req.user.role === "customer") {

            if (!booking.customerId) {
                return res.status(403).json({
                    success: false,
                    message:
                        "Booking không có thông tin customer"
                });
            }

            const customerId =
                booking.customerId._id
                    ? booking.customerId._id.toString()
                    : booking.customerId.toString();

            if (customerId !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message:
                        "Bạn không có quyền hủy booking này"
                });
            }
        }


        // --------------------------------------------------
        // STAFF + ADMIN
        // Có quyền xử lý hủy booking
        // --------------------------------------------------

        const result =
            await bookingService.cancelBooking(
                req.params.id
            );

        res.json({
            success: true,
            message: "Hủy booking thành công",
            data: result
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// DELETE BOOKING - ADMIN
// ======================================================

const deleteBooking = async (req, res) => {
    try {

        const booking =
            await bookingService.deleteBooking(
                req.params.id
            );

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy booking"
            });
        }

        res.json({
            success: true,
            message: "Xóa booking thành công"
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
// ======================================================
// GET BOOKED SLOTS
// CUSTOMER + STAFF + ADMIN
// ======================================================

const getBookedSlots = async (
    req,
    res
) => {

    try {

        const {
            fieldId,
            bookingDate
        } = req.query;


        if (!fieldId) {

            return res.status(400).json({
                success: false,
                message:
                    "Thiếu fieldId"
            });
        }


        if (!bookingDate) {

            return res.status(400).json({
                success: false,
                message:
                    "Thiếu bookingDate"
            });
        }


        const bookings =
            await bookingService.getBookedSlots(
                fieldId,
                bookingDate
            );


        return res.json({
            success: true,
            data: bookings
        });

    } catch (error) {

        console.error(
            "Get booked slots error:",
            error
        );


        return res.status(500).json({
            success: false,
            message:
                error.message
        });
    }
};

module.exports = {
    createBooking,
    getAllBookings,
    getMyBookings,
    getBookingById,
    getBookedSlots,
    updateBooking,
    cancelBooking,
    deleteBooking
};
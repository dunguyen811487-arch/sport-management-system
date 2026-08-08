const bookingService = require(
    "../services/booking.service"
);


// ======================================================
// CREATE
// ======================================================

const createBooking = async (req, res) => {

    try {

        const bookingData = {
            ...req.body,

            // Lấy customerId từ JWT
            customerId: req.user.id
        };

        const booking =
            await bookingService.createBooking(
                bookingData
            );

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
// GET ALL - ADMIN
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
// GET BY ID
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

        // Customer chỉ được xem booking của mình
        if (
            req.user.role === "customer" &&
            booking.customerId._id.toString() !== req.user.id
        ) {
            return res.status(403).json({
                success: false,
                message: "Bạn không có quyền xem booking này"
            });
        }

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
// UPDATE - ADMIN
// ======================================================

const updateBooking = async (req, res) => {

    try {

        const booking =
            await bookingService.updateBooking(
                req.params.id,
                req.body
            );

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
// CANCEL - CUSTOMER
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

        // Customer chỉ được hủy booking của mình
        if (
            req.user.role === "customer" &&
            booking.customerId._id.toString() !== req.user.id
        ) {
            return res.status(403).json({
                success: false,
                message: "Bạn không có quyền hủy booking này"
            });
        }

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
// DELETE - ADMIN
// ======================================================

const deleteBooking = async (req, res) => {

    try {

        await bookingService.deleteBooking(
            req.params.id
        );

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


module.exports = {
    createBooking,
    getAllBookings,
    getMyBookings,
    getBookingById,
    updateBooking,
    cancelBooking,
    deleteBooking
};
const paymentService = require(
    "../services/payment.service"
);


// CREATE
const createPayment = async (req, res) => {

    try {

        // Kiểm tra booking thuộc customer
        const Booking = require(
            "../models/booking.model"
        );

        const booking = await Booking.findById(
            req.body.bookingId
        );

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy booking"
            });
        }

        if (
            req.user.role === "customer" &&
            booking.customerId.toString() !== req.user.id
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Bạn không có quyền thanh toán booking này"
            });
        }

        const payment =
            await paymentService.createPayment(
                req.body
            );

        res.status(201).json({
            success: true,
            message: "Tạo thanh toán thành công",
            data: payment
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};


// GET ALL - ADMIN
const getAllPayments = async (req, res) => {

    try {

        const payments =
            await paymentService.getAllPayments();

        res.json({
            success: true,
            data: payments
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// GET MY PAYMENTS - CUSTOMER
const getMyPayments = async (req, res) => {

    try {

        const payments =
            await paymentService.getPaymentsByCustomer(
                req.user.id
            );

        res.json({
            success: true,
            data: payments
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// GET BY ID
const getPaymentById = async (req, res) => {

    try {

        const payment =
            await paymentService.getPaymentById(
                req.params.id
            );

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy payment"
            });
        }

        // Customer chỉ được xem payment của mình
        if (
            req.user.role === "customer" &&
            payment.bookingId.customerId._id.toString()
                !== req.user.id
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Bạn không có quyền xem payment này"
            });
        }

        res.json({
            success: true,
            data: payment
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// UPDATE - ADMIN
const updatePayment = async (req, res) => {

    try {

        const payment =
            await paymentService.updatePayment(
                req.params.id,
                req.body
            );

        res.json({
            success: true,
            message:
                "Cập nhật payment thành công",
            data: payment
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};


// DELETE - ADMIN
const deletePayment = async (req, res) => {

    try {

        await paymentService.deletePayment(
            req.params.id
        );

        res.json({
            success: true,
            message: "Xóa payment thành công"
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};


module.exports = {
    createPayment,
    getAllPayments,
    getMyPayments,
    getPaymentById,
    updatePayment,
    deletePayment
};
const Payment = require("../models/payment.model");
const Booking = require("../models/booking.model");


// ======================================================
// CREATE PAYMENT
// ======================================================

const createPayment = async (data) => {

    const booking = await Booking.findById(
        data.bookingId
    );

    if (!booking) {
        throw new Error("Không tìm thấy booking");
    }

    if (booking.status === "cancelled") {
        throw new Error(
            "Booking đã bị hủy, không thể thanh toán"
        );
    }

    const existedPayment = await Payment.findOne({
        bookingId: data.bookingId
    });

    if (existedPayment) {
        throw new Error(
            "Booking này đã có thanh toán"
        );
    }

    if (
        data.paymentMethod !== "cash" &&
        data.paymentMethod !== "bank_transfer"
    ) {
        throw new Error(
            "Phương thức thanh toán không hợp lệ"
        );
    }

    // Tự lấy tiền từ Booking
    data.amount = booking.totalPrice;

    // Customer tạo payment → pending
    data.status = "pending";

    if (data.paymentMethod === "cash") {
        data.transactionCode = "";
    }

    if (
        data.paymentMethod === "bank_transfer" &&
        !data.transactionCode
    ) {
        throw new Error(
            "Vui lòng nhập mã giao dịch chuyển khoản"
        );
    }

    data.paidAt = null;

    return await Payment.create(data);
};


// ======================================================
// GET ALL - ADMIN
// ======================================================

const getAllPayments = async () => {

    return await Payment.find()
        .populate({
            path: "bookingId",
            populate: [
                {
                    path: "customerId"
                },
                {
                    path: "fieldId"
                }
            ]
        });
};


// ======================================================
// GET PAYMENTS BY CUSTOMER
// ======================================================

const getPaymentsByCustomer = async (customerId) => {

    const bookings = await Booking.find({
        customerId: customerId
    }).select("_id");

    const bookingIds = bookings.map(
        booking => booking._id
    );

    return await Payment.find({
        bookingId: {
            $in: bookingIds
        }
    }).populate({
        path: "bookingId",
        populate: [
            {
                path: "customerId"
            },
            {
                path: "fieldId"
            }
        ]
    });
};


// ======================================================
// GET PAYMENT BY ID
// ======================================================

const getPaymentById = async (id) => {

    return await Payment.findById(id)
        .populate({
            path: "bookingId",
            populate: [
                {
                    path: "customerId"
                },
                {
                    path: "fieldId"
                }
            ]
        });
};


// ======================================================
// UPDATE PAYMENT - ADMIN
// ======================================================

const updatePayment = async (id, data) => {

    const payment = await Payment.findById(id);

    if (!payment) {
        throw new Error(
            "Không tìm thấy payment"
        );
    }

    // Không cho sửa booking
    delete data.bookingId;

    // Không cho sửa amount
    delete data.amount;

    // Thanh toán thành công
    if (
        data.status === "paid" &&
        payment.status !== "paid"
    ) {

        data.paidAt = new Date();

        const booking = await Booking.findById(
            payment.bookingId
        );

        if (booking) {
            booking.status = "confirmed";
            await booking.save();
        }
    }

    // Thanh toán thất bại
    if (data.status === "failed") {
        data.paidAt = null;
    }

    // Hoàn tiền
    if (data.status === "refunded") {

        data.paidAt = null;

        const booking = await Booking.findById(
            payment.bookingId
        );

        if (booking) {
            booking.status = "cancelled";
            await booking.save();
        }
    }

    return await Payment.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true
        }
    );
};


// ======================================================
// DELETE - ADMIN
// ======================================================

const deletePayment = async (id) => {

    const payment = await Payment.findById(id);

    if (!payment) {
        throw new Error(
            "Không tìm thấy payment"
        );
    }

    return await Payment.findByIdAndDelete(id);
};


module.exports = {
    createPayment,
    getAllPayments,
    getPaymentsByCustomer,
    getPaymentById,
    updatePayment,
    deletePayment
};
const Payment =
    require("../models/payment.model");

const Booking =
    require("../models/booking.model");


// ======================================================
// CREATE PAYMENT
// CUSTOMER
// ======================================================

const createPayment = async (
    data
) => {

    // --------------------------------------------------
    // 1. Kiểm tra booking
    // --------------------------------------------------

    const booking =
        await Booking.findById(
            data.bookingId
        );


    if (!booking) {

        throw new Error(
            "Không tìm thấy booking"
        );
    }


    // --------------------------------------------------
    // 2. Không cho thanh toán booking đã hủy
    // --------------------------------------------------

    if (
        booking.status ===
        "cancelled"
    ) {

        throw new Error(
            "Booking đã bị hủy, không thể thanh toán"
        );
    }


    // --------------------------------------------------
    // 3. Chỉ xử lý booking pending
    // --------------------------------------------------

    if (
        booking.status !==
        "pending"
    ) {

        throw new Error(
            "Booking này không ở trạng thái chờ thanh toán"
        );
    }


    // --------------------------------------------------
    // 4. Kiểm tra payment đã tồn tại
    // --------------------------------------------------

    const existedPayment =
        await Payment.findOne({
            bookingId:
                data.bookingId
        });


    if (existedPayment) {

        // Nếu payment cũ đã cancelled
        // thì không cho tạo lại trên cùng booking

        if (
            existedPayment.status ===
            "cancelled"
        ) {

            throw new Error(
                "Booking này đã bị hủy, không thể thanh toán"
            );
        }


        // Nếu bank transfer có ảnh mới
        if (
            data.paymentMethod ===
                "bank_transfer" &&
            data.paymentProof
        ) {

            existedPayment.paymentProof =
                data.paymentProof;


            await existedPayment.save();
        }


        return existedPayment;
    }


    // --------------------------------------------------
    // 5. Kiểm tra payment method
    // --------------------------------------------------

    if (
        data.paymentMethod !==
            "cash" &&
        data.paymentMethod !==
            "bank_transfer"
    ) {

        throw new Error(
            "Phương thức thanh toán không hợp lệ"
        );
    }


    // --------------------------------------------------
    // 6. Bank transfer phải có ảnh
    // --------------------------------------------------

    if (
        data.paymentMethod ===
        "bank_transfer"
    ) {

        if (
            !data.paymentProof
        ) {

            throw new Error(
                "Vui lòng tải ảnh xác nhận chuyển khoản"
            );
        }
    }


    // --------------------------------------------------
    // 7. Cash không cần ảnh
    // --------------------------------------------------

    const paymentProof =
        data.paymentMethod ===
        "bank_transfer"
            ? data.paymentProof
            : "";


    // --------------------------------------------------
    // 8. Transaction code
    // --------------------------------------------------

    const transactionCode =
        data.transactionCode ||
        "";


    // --------------------------------------------------
    // 9. Amount lấy từ booking
    // --------------------------------------------------

    const amount =
        booking.totalPrice;


    // --------------------------------------------------
    // 10. Payment data
    // --------------------------------------------------

    const paymentData = {

        bookingId:
            booking._id,

        amount,

        paymentMethod:
            data.paymentMethod,

        status:
            "pending",

        paymentProof,

        transactionCode,

        paidAt:
            null
    };


    // --------------------------------------------------
    // 11. Create payment
    // --------------------------------------------------

    return await Payment.create(
        paymentData
    );
};


// ======================================================
// GET ALL PAYMENTS
// STAFF + ADMIN
// ======================================================

const getAllPayments =
    async () => {

        return await Payment
            .find()
            .populate({
                path:
                    "bookingId",

                populate: [
                    {
                        path:
                            "customerId",

                        select:
                            "-password"
                    },

                    {
                        path:
                            "fieldId"
                    }
                ]
            })
            .sort({
                createdAt:
                    -1
            });
    };


// ======================================================
// GET PAYMENTS BY CUSTOMER
// CUSTOMER
// ======================================================

const getPaymentsByCustomer =
    async (
        customerId
    ) => {

        const bookings =
            await Booking.find({
                customerId
            }).select(
                "_id"
            );


        const bookingIds =
            bookings.map(
                booking =>
                    booking._id
            );


        return await Payment
            .find({
                bookingId: {
                    $in:
                        bookingIds
                }
            })
            .populate({
                path:
                    "bookingId",

                populate: [
                    {
                        path:
                            "customerId",

                        select:
                            "-password"
                    },

                    {
                        path:
                            "fieldId"
                    }
                ]
            })
            .sort({
                createdAt:
                    -1
            });
    };


// ======================================================
// GET PAYMENT BY ID
// CUSTOMER + STAFF + ADMIN
// ======================================================

const getPaymentById =
    async (
        id
    ) => {

        return await Payment
            .findById(id)
            .populate({
                path:
                    "bookingId",

                populate: [
                    {
                        path:
                            "customerId",

                        select:
                            "-password"
                    },

                    {
                        path:
                            "fieldId"
                    }
                ]
            });
    };


// ======================================================
// UPDATE PAYMENT
// STAFF + ADMIN
// ======================================================

const updatePayment =
    async (
        id,
        data
    ) => {

        const payment =
            await Payment.findById(
                id
            );


        if (!payment) {

            throw new Error(
                "Không tìm thấy payment"
            );
        }


        // --------------------------------------------------
        // Không cho sửa dữ liệu gốc
        // --------------------------------------------------

        delete data.bookingId;

        delete data.amount;

        delete data.paymentMethod;

        delete data.paymentProof;

        delete data.transactionCode;


        // ==================================================
        // PAID
        // ==================================================

        if (
            data.status ===
                "paid" &&
            payment.status !==
                "paid"
        ) {

            data.paidAt =
                new Date();


            const booking =
                await Booking.findById(
                    payment.bookingId
                );


            if (booking) {

                // Không xác nhận booking đã bị hủy
                if (
                    booking.status !==
                    "cancelled"
                ) {

                    booking.status =
                        "confirmed";


                    booking.paymentExpiresAt =
                        null;


                    await booking.save();
                }
            }
        }


        // ==================================================
        // FAILED
        // ==================================================

        if (
            data.status ===
            "failed"
        ) {

            data.paidAt =
                null;
        }


        // ==================================================
        // CANCELLED
        // ==================================================
        //
        // Dùng khi booking bị hủy trước khi
        // payment được xác nhận.
        //
        // ==================================================

        if (
            data.status ===
            "cancelled"
        ) {

            data.paidAt =
                null;
        }


        // ==================================================
        // REFUNDED
        // ==================================================
        //
        // Dùng cho payment đã paid nhưng sau đó
        // phát sinh hoàn tiền.
        //
        // ==================================================

        if (
            data.status ===
            "refunded"
        ) {

            data.paidAt =
                null;


            const booking =
                await Booking.findById(
                    payment.bookingId
                );


            if (booking) {

                booking.status =
                    "cancelled";


                booking.paymentExpiresAt =
                    null;


                await booking.save();
            }
        }


        // ==================================================
        // UPDATE PAYMENT
        // ==================================================

        return await Payment
            .findByIdAndUpdate(
                id,
                data,
                {
                    new:
                        true,

                    runValidators:
                        true
                }
            )
            .populate({
                path:
                    "bookingId",

                populate: [
                    {
                        path:
                            "customerId",

                        select:
                            "-password"
                    },

                    {
                        path:
                            "fieldId"
                    }
                ]
            });
    };


// ======================================================
// DELETE PAYMENT
// ADMIN
// ======================================================

const deletePayment =
    async (
        id
    ) => {

        const payment =
            await Payment.findById(
                id
            );


        if (!payment) {

            throw new Error(
                "Không tìm thấy payment"
            );
        }


        return await Payment
            .findByIdAndDelete(
                id
            );
    };


module.exports = {

    createPayment,

    getAllPayments,

    getPaymentsByCustomer,

    getPaymentById,

    updatePayment,

    deletePayment
};
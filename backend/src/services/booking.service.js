const Booking = require("../models/booking.model");
const Field = require("../models/field.model");


// ======================================================
// CREATE BOOKING
// ======================================================

const createBooking = async (data) => {

    // Kiểm tra sân
    const field = await Field.findById(data.fieldId);

    if (!field) {
        throw new Error("Không tìm thấy sân");
    }

    // Kiểm tra sân có đang hoạt động
    if (field.status !== "active") {
        throw new Error("Sân hiện không hoạt động");
    }

    // Lấy các booking cùng sân, cùng ngày
    const bookings = await Booking.find({
        fieldId: data.fieldId,
        bookingDate: data.bookingDate,
        status: {
            $ne: "cancelled"
        }
    });

    // Kiểm tra trùng giờ
    for (const booking of bookings) {

        if (
            data.startTime < booking.endTime &&
            data.endTime > booking.startTime
        ) {
            throw new Error("Khung giờ này đã được đặt");
        }
    }

    // Tính số giờ
    const startHour = Number(
        data.startTime.split(":")[0]
    );

    const endHour = Number(
        data.endTime.split(":")[0]
    );

    const totalHours = endHour - startHour;

    if (totalHours <= 0) {
        throw new Error(
            "Giờ kết thúc phải lớn hơn giờ bắt đầu"
        );
    }

    // Tính tiền
    data.totalPrice =
        totalHours * field.pricePerHour;

    // Mặc định pending
    data.status = "pending";

    return await Booking.create(data);
};


// ======================================================
// GET ALL BOOKINGS - ADMIN
// ======================================================

const getAllBookings = async () => {

    return await Booking.find()
        .populate("customerId")
        .populate("fieldId");
};


// ======================================================
// GET BOOKINGS BY CUSTOMER
// ======================================================

const getBookingsByCustomer = async (customerId) => {

    return await Booking.find({
        customerId: customerId
    })
        .populate("customerId")
        .populate("fieldId");
};


// ======================================================
// GET BOOKING BY ID
// ======================================================

const getBookingById = async (id) => {

    return await Booking.findById(id)
        .populate("customerId")
        .populate("fieldId");
};


// ======================================================
// UPDATE BOOKING
// ======================================================

const updateBooking = async (id, data) => {

    const booking = await Booking.findById(id);

    if (!booking) {
        throw new Error("Không tìm thấy booking");
    }

    // Không cho sửa customerId
    delete data.customerId;

    // Không cho tự ý sửa totalPrice
    delete data.totalPrice;

    return await Booking.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true
        }
    );
};


// ======================================================
// CANCEL BOOKING
// ======================================================

const cancelBooking = async (id) => {

    const booking = await Booking.findById(id);

    if (!booking) {
        throw new Error("Không tìm thấy booking");
    }

    if (booking.status === "cancelled") {
        throw new Error("Booking đã được hủy");
    }

    booking.status = "cancelled";

    await booking.save();

    return booking;
};


// ======================================================
// DELETE BOOKING - ADMIN
// ======================================================

const deleteBooking = async (id) => {

    const booking = await Booking.findById(id);

    if (!booking) {
        throw new Error("Không tìm thấy booking");
    }

    return await Booking.findByIdAndDelete(id);
};


module.exports = {
    createBooking,
    getAllBookings,
    getBookingsByCustomer,
    getBookingById,
    updateBooking,
    cancelBooking,
    deleteBooking
};
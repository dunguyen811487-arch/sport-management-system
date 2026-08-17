const Booking =
    require("../models/booking.model");
const Payment =
    require("../models/payment.model");
const Field =
    require("../models/field.model");


// ======================================================
// HELPER: CHUYỂN HH:mm -> SỐ GIỜ
// ======================================================

const convertTimeToHour = (
    time
) => {

    if (
        !time ||
        typeof time !== "string"
    ) {
        return NaN;
    }

    const parts =
        time.split(":");

    if (
        parts.length !== 2
    ) {
        return NaN;
    }

    const hour =
        parseInt(
            parts[0],
            10
        );

    const minute =
        parseInt(
            parts[1],
            10
        );

    if (
        Number.isNaN(hour) ||
        Number.isNaN(minute) ||
        hour < 0 ||
        hour > 23 ||
        minute < 0 ||
        minute > 59
    ) {
        return NaN;
    }

    return (
        hour +
        minute / 60
    );
};


// ======================================================
// HELPER: KIỂM TRA GIỜ
// ======================================================

const validateTime = (
    startTime,
    endTime
) => {

    if (
        !startTime ||
        !endTime
    ) {
        throw new Error(
            "Vui lòng nhập giờ bắt đầu và giờ kết thúc"
        );
    }

    const startHour =
        convertTimeToHour(
            startTime
        );

    const endHour =
        convertTimeToHour(
            endTime
        );

    if (
        Number.isNaN(startHour) ||
        Number.isNaN(endHour)
    ) {
        throw new Error(
            "Thời gian không hợp lệ. Định dạng phải là HH:mm"
        );
    }

    if (
        endHour <= startHour
    ) {
        throw new Error(
            "Giờ kết thúc phải lớn hơn giờ bắt đầu"
        );
    }

    return {
        startHour,
        endHour
    };
};


// ======================================================
// EXPIRE PENDING BOOKINGS
// ======================================================
//
// Booking pending quá 15 phút:
// → chuyển cancelled
// → không còn giữ sân
//
// ======================================================

const expirePendingBookings =
    async () => {

        const now =
            new Date();


        const expiredBookings =
            await Booking.find({
                status: "pending",

                paymentExpiresAt: {
                    $ne: null,
                    $lte: now
                }
            }).select("_id");


        if (
            expiredBookings.length === 0
        ) {
            return {
                modifiedCount: 0
            };
        }


        const bookingIds =
            expiredBookings.map(
                booking =>
                    booking._id
            );


        // ==================================================
        // 1. HỦY BOOKING HẾT HẠN
        // ==================================================

        const result =
            await Booking.updateMany(
                {
                    _id: {
                        $in:
                            bookingIds
                    },

                    status:
                        "pending"
                },
                {
                    $set: {
                        status:
                            "cancelled",

                        paymentExpiresAt:
                            null
                    }
                }
            );


        // ==================================================
        // 2. ĐỒNG BỘ PAYMENT
        // ==================================================
        //
        // Chỉ pending -> cancelled.
        // Payment paid không bị đổi.
        //
        // ==================================================

        await Payment.updateMany(
            {
                bookingId: {
                    $in:
                        bookingIds
                },

                status:
                    "pending"
            },
            {
                $set: {
                    status:
                        "cancelled",

                    paidAt:
                        null
                }
            }
        );


        if (
            result.modifiedCount > 0
        ) {

            console.log(
                `Đã tự động hủy ${result.modifiedCount} booking pending hết hạn.`
            );
        }


        return result;
    };


// ======================================================
// HELPER: KIỂM TRA CHỒNG GIỜ
// ======================================================

const checkOverlappingBooking =
    async ({
        fieldId,
        bookingDate,
        startHour,
        endHour,
        excludeBookingId = null
    }) => {

        await expirePendingBookings();

        const query = {
            fieldId: fieldId,

            bookingDate: bookingDate,

            // Chỉ cancelled là không chiếm sân.
            status: {
                $ne: "cancelled"
            },

            $expr: {
                $and: [

                    // start < requested end
                    {
                        $lt: [
                            {
                                $add: [
                                    {
                                        $toInt: {
                                            $arrayElemAt: [
                                                {
                                                    $split: [
                                                        "$startTime",
                                                        ":"
                                                    ]
                                                },
                                                0
                                            ]
                                        }
                                    },
                                    {
                                        $divide: [
                                            {
                                                $toInt: {
                                                    $arrayElemAt: [
                                                        {
                                                            $split: [
                                                                "$startTime",
                                                                ":"
                                                            ]
                                                        },
                                                        1
                                                    ]
                                                }
                                            },
                                            60
                                        ]
                                    }
                                ]
                            },
                            endHour
                        ]
                    },

                    // end > requested start
                    {
                        $gt: [
                            {
                                $add: [
                                    {
                                        $toInt: {
                                            $arrayElemAt: [
                                                {
                                                    $split: [
                                                        "$endTime",
                                                        ":"
                                                    ]
                                                },
                                                0
                                            ]
                                        }
                                    },
                                    {
                                        $divide: [
                                            {
                                                $toInt: {
                                                    $arrayElemAt: [
                                                        {
                                                            $split: [
                                                                "$endTime",
                                                                ":"
                                                            ]
                                                        },
                                                        1
                                                    ]
                                                }
                                            },
                                            60
                                        ]
                                    }
                                ]
                            },
                            startHour
                        ]
                    }
                ]
            }
        };

        if (
            excludeBookingId
        ) {
            query._id = {
                $ne:
                    excludeBookingId
            };
        }

        return await Booking.findOne(
            query
        );
    };


// ======================================================
// CREATE BOOKING
// ======================================================

const createBooking =
    async (
        data
    ) => {

        const field =
            await Field.findById(
                data.fieldId
            );

        if (!field) {
            throw new Error(
                "Sân không tồn tại"
            );
        }

        if (
            field.status !==
            "active"
        ) {
            throw new Error(
                "Sân hiện không hoạt động"
            );
        }

        const {
            startHour,
            endHour
        } =
            validateTime(
                data.startTime,
                data.endTime
            );

        const overlappingBooking =
            await checkOverlappingBooking({
                fieldId:
                    data.fieldId,

                bookingDate:
                    data.bookingDate,

                startHour,
                endHour
            });

        if (
            overlappingBooking
        ) {
            throw new Error(
                "Khung giờ này bị trùng với một booking khác"
            );
        }

        const duration =
            endHour -
            startHour;

        const totalPrice =
            duration *
            field.pricePerHour;

        const paymentExpiresAt =
            new Date(
                Date.now() +
                15 * 60 * 1000
            );

        const bookingData = {

            customerId:
                data.customerId,

            fieldId:
                data.fieldId,

            bookingDate:
                data.bookingDate,

            startTime:
                data.startTime,

            endTime:
                data.endTime,

            totalPrice:
                totalPrice,

            status:
                "pending",

            note:
                data.note || "",

            paymentExpiresAt
        };

        return await Booking.create(
            bookingData
        );
    };


// ======================================================
// GET ALL BOOKINGS
// ======================================================

const getAllBookings =
    async () => {

        await expirePendingBookings();

        return await Booking
            .find()
            .populate({
                path:
                    "customerId",

                select:
                    "-password"
            })
            .populate(
                "fieldId"
            )
            .sort({
                bookingDate: 1,
                startTime: 1
            });
    };


// ======================================================
// GET BOOKING BY ID
// ======================================================

const getBookingById =
    async (
        id
    ) => {

        await expirePendingBookings();

        const booking =
            await Booking.findById(
                id
            )
            .populate({
                path:
                    "customerId",

                select:
                    "-password"
            })
            .populate(
                "fieldId"
            );

        if (!booking) {
            throw new Error(
                "Không tìm thấy booking"
            );
        }

        return booking;
    };


// ======================================================
// GET BOOKINGS BY CUSTOMER
// ======================================================

const getBookingsByCustomer =
    async (
        customerId
    ) => {

        await expirePendingBookings();

        return await Booking
            .find({
                customerId:
                    customerId
            })
            .populate({
                path:
                    "customerId",

                select:
                    "-password"
            })
            .populate(
                "fieldId"
            )
            .sort({
                bookingDate: -1,
                startTime: 1
            });
    };


// ======================================================
// UPDATE BOOKING
// STAFF + ADMIN
// ======================================================

const updateBooking =
    async (
        id,
        data
    ) => {

        const booking =
            await Booking.findById(
                id
            );

        if (!booking) {
            throw new Error(
                "Không tìm thấy booking"
            );
        }

        const updateData = {
            ...data
        };

        delete updateData.customerId;
        delete updateData.totalPrice;

        const newFieldId =
            updateData.fieldId ||
            booking.fieldId;

        const newBookingDate =
            updateData.bookingDate ||
            booking.bookingDate;

        const newStartTime =
            updateData.startTime ||
            booking.startTime;

        const newEndTime =
            updateData.endTime ||
            booking.endTime;

        const field =
            await Field.findById(
                newFieldId
            );

        if (!field) {
            throw new Error(
                "Sân không tồn tại"
            );
        }

        if (
            field.status !==
            "active"
        ) {
            throw new Error(
                "Sân hiện không hoạt động"
            );
        }

        const {
            startHour,
            endHour
        } =
            validateTime(
                newStartTime,
                newEndTime
            );

        const overlappingBooking =
            await checkOverlappingBooking({
                fieldId:
                    newFieldId,

                bookingDate:
                    newBookingDate,

                startHour,
                endHour,

                excludeBookingId:
                    id
            });

        if (
            overlappingBooking
        ) {
            throw new Error(
                "Khung giờ mới bị trùng với một booking khác"
            );
        }

        const duration =
            endHour -
            startHour;

        const totalPrice =
            duration *
            field.pricePerHour;

        updateData.fieldId =
            newFieldId;

        updateData.bookingDate =
            newBookingDate;

        updateData.startTime =
            newStartTime;

        updateData.endTime =
            newEndTime;

        updateData.totalPrice =
            totalPrice;

        const updatedBooking =
            await Booking.findByIdAndUpdate(
                id,
                updateData,
                {
                    new: true,
                    runValidators: true
                }
            )
            .populate({
                path:
                    "customerId",

                select:
                    "-password"
            })
            .populate(
                "fieldId"
            );

        return updatedBooking;
    };


// ======================================================
// CANCEL BOOKING
// ======================================================

const cancelBooking =
    async (
        id
    ) => {

        const booking =
            await Booking.findById(
                id
            );


        if (!booking) {

            throw new Error(
                "Không tìm thấy booking"
            );
        }


        if (
            booking.status ===
            "cancelled"
        ) {

            throw new Error(
                "Booking đã được hủy trước đó"
            );
        }


        // ==================================================
        // 1. HỦY BOOKING
        // ==================================================

        booking.status =
            "cancelled";


        booking.paymentExpiresAt =
            null;


        await booking.save();


        // ==================================================
        // 2. ĐỒNG BỘ PAYMENT
        // ==================================================
        //
        // pending -> cancelled
        //
        // Nếu payment đã paid:
        // không tự đổi sang cancelled.
        // Nếu cần hoàn tiền thì dùng refunded.
        //
        // ==================================================

        const payment =
            await Payment.findOne({
                bookingId:
                    booking._id
            });


        if (
            payment &&
            payment.status ===
                "pending"
        ) {

            payment.status =
                "cancelled";


            payment.paidAt =
                null;


            await payment.save();
        }


        // ==================================================
        // 3. TRẢ BOOKING
        // ==================================================

        return await Booking
            .findById(
                id
            )
            .populate({
                path:
                    "customerId",

                select:
                    "-password"
            })
            .populate(
                "fieldId"
            );
    };


// ======================================================
// DELETE BOOKING
// ======================================================

const deleteBooking =
    async (
        id
    ) => {

        const booking =
            await Booking.findById(
                id
            );

        if (!booking) {
            throw new Error(
                "Không tìm thấy booking"
            );
        }

        await Booking.findByIdAndDelete(
            id
        );

        return booking;
    };
    // ======================================================
// GET BOOKED SLOTS
// CUSTOMER + STAFF + ADMIN
// Lấy tất cả khung giờ đã được đặt của một sân trong một ngày
// ======================================================

const getBookedSlots = async (
    fieldId,
    bookingDate
) => {

    // Tự động hủy booking pending đã hết hạn
    await expirePendingBookings();

    const bookings =
        await Booking.find({
            fieldId,
            bookingDate,

            // Chỉ booking cancelled mới không chiếm sân
            status: {
                $ne: "cancelled"
            }
        })
        .select(
            "_id startTime endTime status"
        )
        .sort({
            startTime: 1
        });


    return bookings;
};

module.exports = {

    createBooking,

    getAllBookings,

    getBookingById,

    getBookingsByCustomer,

    getBookedSlots,

    updateBooking,

    cancelBooking,

    deleteBooking,

    expirePendingBookings
};
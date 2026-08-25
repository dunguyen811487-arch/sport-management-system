const Booking =
    require("../models/booking.model");

const Field =
    require("../models/field.model");

const Payment =
    require("../models/payment.model");


// ======================================================
// HELPER: HH:mm -> SỐ GIỜ
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
// HELPER: TÍNH THỜI ĐIỂM HẾT HẠN BOOKING
//
// Quy tắc:
// Booking 08:00 - 09:00
// → hết hạn lúc 10:00
//
// Booking 19:00 - 20:00
// → hết hạn lúc 21:00
//
// Dùng timezone Việt Nam UTC+07:00
// ======================================================

const calculatePaymentExpireTime = (
    bookingDate,
    endTime
) => {

    if (
        !bookingDate ||
        !endTime
    ) {

        return null;
    }

    const [year, month, day] =
        String(
            bookingDate
        )
            .split("-")
            .map(
                Number
            );

    const [
        hour,
        minute
    ] =
        String(
            endTime
        )
            .split(":")
            .map(
                Number
            );

    if (
        !year ||
        !month ||
        !day ||
        Number.isNaN(hour) ||
        Number.isNaN(minute)
    ) {

        return null;
    }

    // 1 giờ sau endTime
    const expireHour =
        hour + 1;

    const expireDate =
        new Date(
            `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(expireHour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00+07:00`
        );

    if (
        Number.isNaN(
            expireDate.getTime()
        )
    ) {

        return null;
    }

    return expireDate;
};


// ======================================================
// EXPIRE PENDING BOOKINGS
//
// Booking pending quá 1 giờ kể từ endTime:
// → cancelled
// → paymentExpiresAt = null
// → payment pending = failed
// ======================================================

const expirePendingBookings =
    async () => {

        const now =
            new Date();


        // ==================================================
        // LẤY BOOKING PENDING
        //
        // Không dùng paymentExpiresAt cũ nữa.
        // Tính trực tiếp theo bookingDate + endTime.
        // ==================================================

        const pendingBookings =
            await Booking.find({
                status:
                    "pending"
            });


        if (
            pendingBookings.length === 0
        ) {

            return {
                modifiedCount:
                    0
            };
        }


        let modifiedCount =
            0;


        for (
            const booking of
            pendingBookings
        ) {

            const expireTime =
                calculatePaymentExpireTime(
                    booking.bookingDate,
                    booking.endTime
                );


            if (
                !expireTime
            ) {

                continue;
            }


            // ==================================================
            // CHƯA ĐẾN HẠN
            // ==================================================

            if (
                now <
                expireTime
            ) {

                continue;
            }


            // ==================================================
            // ĐÃ QUÁ 1 GIỜ
            // ==================================================

            booking.status =
                "cancelled";

            booking.paymentExpiresAt =
                null;


            await booking.save();


            // ==================================================
            // PAYMENT
            //
            // Nếu payment vẫn pending
            // → failed
            //
            // Payment đã paid thì booking đáng ra đã confirmed,
            // nên không rơi vào đây.
            // ==================================================

            await Payment.updateOne(
                {
                    bookingId:
                        booking._id,

                    status:
                        "pending"
                },
                {
                    $set: {
                        status:
                            "failed",

                        paidAt:
                            null
                    }
                }
            );


            modifiedCount++;


            console.log(
                `[BOOKING AUTO CANCEL] Booking ${booking._id} đã tự động hủy. Hết hạn lúc ${expireTime.toLocaleString("vi-VN")}`
            );
        }


        if (
            modifiedCount > 0
        ) {

            console.log(
                `Đã tự động hủy ${modifiedCount} booking pending quá hạn.`
            );
        }


        return {
            modifiedCount
        };
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

        // ==================================================
        // DỌN BOOKING HẾT HẠN
        // ==================================================

        await expirePendingBookings();


        const query = {

            fieldId:

                fieldId,

            bookingDate:

                bookingDate,

            // Chỉ cancelled không chiếm sân
            status: {

                $ne:
                    "cancelled"

            },

            $expr: {

                $and: [

                    // ------------------------------------------------
                    // start < requested end
                    // ------------------------------------------------

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


                    // ------------------------------------------------
                    // end > requested start
                    // ------------------------------------------------

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


        // ==================================================
        // HẠN THANH TOÁN
        //
        // endTime + 1 giờ
        // ==================================================

        const paymentExpiresAt =
            calculatePaymentExpireTime(
                data.bookingDate,
                data.endTime
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
                bookingDate:
                    1,

                startTime:
                    1
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
            await Booking
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
                bookingDate:
                    -1,

                startTime:
                    1
            });
    };


// ======================================================
// GET BOOKED SLOTS
// CUSTOMER + STAFF + ADMIN
// ======================================================

const getBookedSlots =
    async (
        fieldId,
        bookingDate
    ) => {

        await expirePendingBookings();


        return await Booking
            .find({
                fieldId,

                bookingDate,

                status: {
                    $ne:
                        "cancelled"
                }
            })
            .select(
                "_id startTime endTime status"
            )
            .sort({
                startTime:
                    1
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


        // ==================================================
        // CẬP NHẬT HẠN HỦY
        // ==================================================

        updateData.paymentExpiresAt =
            calculatePaymentExpireTime(
                newBookingDate,
                newEndTime
            );


        const updatedBooking =
            await Booking
                .findByIdAndUpdate(
                    id,

                    updateData,

                    {
                        new:
                            true,

                        runValidators:
                            true
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
// CUSTOMER
// ======================================================

const cancelBooking = async (id) => {

    const booking =
        await Booking.findById(id);

    if (!booking) {

        throw new Error(
            "Không tìm thấy booking"
        );
    }


    // ==================================================
    // ĐÃ HỦY
    // ==================================================

    if (
        booking.status ===
        "cancelled"
    ) {

        throw new Error(
            "Booking đã được hủy trước đó"
        );
    }


    // ==================================================
    // ĐÃ XÁC NHẬN
    // KHÔNG CHO CUSTOMER HỦY
    // ==================================================

    if (
        booking.status ===
        "confirmed"
    ) {

        throw new Error(
            "Booking đã được xác nhận, không thể hủy"
        );
    }


    // ==================================================
    // CHỈ CHO HỦY BOOKING PENDING
    // ==================================================

    if (
        booking.status !==
        "pending"
    ) {

        throw new Error(
            "Booking không thể hủy"
        );
    }


    // ==================================================
    // HỦY BOOKING
    // ==================================================

    booking.status =
        "cancelled";

    booking.paymentExpiresAt =
        null;


    await booking.save();


    // ==================================================
    // PAYMENT PENDING → FAILED
    // ==================================================

    await Payment.updateOne(
        {
            bookingId:
                booking._id,

            status:
                "pending"
        },
        {
            $set: {

                status:
                    "failed",

                paidAt:
                    null
            }
        }
    );


    // ==================================================
    // RETURN BOOKING
    // ==================================================

    return await Booking
        .findById(id)
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
// EXPORT
// ======================================================

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
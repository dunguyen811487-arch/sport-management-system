import apiClient from "./apiClient";


// ==========================================================
// CREATE BOOKING
// ==========================================================

export const createBookingApi = (
    data
) => {

    return apiClient(
        "/bookings",
        {
            method: "POST",
            body: JSON.stringify(data),
        }
    );
};


// ==========================================================
// GET MY BOOKINGS
// ==========================================================

export const getMyBookingsApi = () => {

    return apiClient(
        "/bookings/my",
        {
            method: "GET",
        }
    );
};


// ==========================================================
// GET ALL BOOKINGS
// ADMIN / STAFF
// ==========================================================

export const getAllBookingsApi = () => {

    return apiClient(
        "/bookings",
        {
            method: "GET",
        }
    );
};


// ==========================================================
// GET BOOKING BY ID
// ==========================================================

export const getBookingByIdApi = (
    id
) => {

    if (!id) {

        throw new Error(
            "Không xác định được ID booking."
        );
    }


    return apiClient(
        `/bookings/${id}`,
        {
            method: "GET",
        }
    );
};


// ==========================================================
// UPDATE BOOKING
// ==========================================================

export const updateBookingApi = (
    id,
    data
) => {

    if (!id) {

        throw new Error(
            "Không xác định được ID booking."
        );
    }


    return apiClient(
        `/bookings/${id}`,
        {
            method: "PUT",
            body: JSON.stringify(data),
        }
    );
};


// ==========================================================
// CANCEL BOOKING
// ==========================================================

export const cancelBookingApi = (
    id
) => {

    if (!id) {

        throw new Error(
            "Không xác định được ID booking."
        );
    }


    return apiClient(
        `/bookings/${id}/cancel`,
        {
            method: "PUT",
        }
    );
};


// ==========================================================
// DELETE BOOKING
// ==========================================================

export const deleteBookingApi = (
    id
) => {

    if (!id) {

        throw new Error(
            "Không xác định được ID booking."
        );
    }


    return apiClient(
        `/bookings/${id}`,
        {
            method: "DELETE",
        }
    );
};


// ==========================================================
// GET BOOKED SLOTS
//
// Lấy booking của TẤT CẢ tài khoản
// theo sân + ngày
// ==========================================================

export const getBookedSlotsApi = (
    fieldId,
    bookingDate
) => {

    if (!fieldId) {

        throw new Error(
            "Không xác định được sân."
        );
    }


    if (!bookingDate) {

        throw new Error(
            "Chưa chọn ngày đặt sân."
        );
    }


    const query =
        new URLSearchParams({
            fieldId,
            bookingDate,
        });


    return apiClient(
        `/bookings/availability?${query.toString()}`,
        {
            method: "GET",
        }
    );
};
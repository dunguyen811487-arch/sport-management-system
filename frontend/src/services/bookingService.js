import apiClient from "../api/apiClient";

const bookingService = {

    // ======================================================
    // GET ALL BOOKINGS
    // ADMIN / STAFF
    // ======================================================

    getAll() {

        return apiClient(
            "/bookings",
            {
                method: "GET",
            }
        );
    },


    // ======================================================
    // GET BOOKING BY ID
    // ======================================================

    getById(id) {

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
    },


    // ======================================================
    // CREATE BOOKING
    // ======================================================

    create(data) {

        return apiClient(
            "/bookings",
            {
                method: "POST",
                body: JSON.stringify(data),
            }
        );
    },


    // ======================================================
    // UPDATE BOOKING
    // ======================================================

    update(id, data) {

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
    },


    // ======================================================
    // DELETE BOOKING
    // ======================================================

    remove(id) {

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
    },

};

export default bookingService;
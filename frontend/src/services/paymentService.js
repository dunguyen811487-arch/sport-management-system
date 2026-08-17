import apiClient from "../api/apiClient";

const paymentService = {

    // ======================================================
    // CREATE PAYMENT
    // data có thể là Object hoặc FormData
    // ======================================================

    create: async (
        data
    ) => {

        const isFormData =
            data instanceof FormData;


        return apiClient(
            "/payments",
            {
                method:
                    "POST",

                body:
                    isFormData
                        ? data
                        : JSON.stringify(
                            data
                        ),
            }
        );
    },


    // ======================================================
    // GET MY
    // ======================================================

    getMy: async () => {

        return apiClient(
            "/payments/my",
            {
                method: "GET",
            }
        );
    },


    // ======================================================
    // GET ALL
    // ======================================================

    getAll: async () => {

        return apiClient(
            "/payments",
            {
                method: "GET",
            }
        );
    },


    // ======================================================
    // GET BY ID
    // ======================================================

    getById: async (
        id
    ) => {

        if (!id) {

            throw new Error(
                "Không xác định được ID payment."
            );
        }


        return apiClient(
            `/payments/${id}`,
            {
                method: "GET",
            }
        );
    },


    // ======================================================
    // UPDATE
    // ======================================================

    update: async (
        id,
        data
    ) => {

        if (!id) {

            throw new Error(
                "Không xác định được ID payment."
            );
        }


        return apiClient(
            `/payments/${id}`,
            {
                method:
                    "PUT",

                body:
                    JSON.stringify(
                        data
                    ),
            }
        );
    },


    // ======================================================
    // DELETE
    // ======================================================

    remove: async (
        id
    ) => {

        if (!id) {

            throw new Error(
                "Không xác định được ID payment."
            );
        }


        return apiClient(
            `/payments/${id}`,
            {
                method:
                    "DELETE",
            }
        );
    },
};


export default paymentService;
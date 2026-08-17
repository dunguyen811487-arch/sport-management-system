import API from "../config/api";

const apiClient = async (
    endpoint,
    options = {}
) => {

    try {

        const config = {
            url:
                endpoint,

            method:
                options.method ||
                "GET",
        };


        // =====================================================
        // TOKEN
        // =====================================================

        const token =
            localStorage.getItem(
                "token"
            );


        // =====================================================
        // KIỂM TRA FORMDATA
        // =====================================================

        const isFormData =
            options.body instanceof FormData;


        // =====================================================
        // BODY
        // =====================================================

        if (
            options.body !== undefined
        ) {

            // -------------------------------------------------
            // FORMDATA
            // -------------------------------------------------

            if (
                isFormData
            ) {

                config.data =
                    options.body;

            }

            // -------------------------------------------------
            // JSON
            // -------------------------------------------------

            else {

                try {

                    config.data =
                        typeof options.body ===
                        "string"

                            ? JSON.parse(
                                options.body
                            )

                            : options.body;

                } catch {

                    config.data =
                        options.body;
                }
            }
        }


        // =====================================================
        // HEADERS
        // =====================================================

        config.headers = {
            ...(options.headers || {}),
        };


        // =====================================================
        // JSON REQUEST
        // =====================================================

        if (
            options.body !== undefined &&
            !isFormData
        ) {

            config.headers[
                "Content-Type"
            ] =
                "application/json";
        }


        // =====================================================
        // FORMDATA REQUEST
        // =====================================================
        //
        // QUAN TRỌNG:
        // Không được tự đặt:
        //
        // Content-Type: application/json
        //
        // Browser/Axios phải tự tạo:
        //
        // multipart/form-data;
        // boundary=...
        //
        // =====================================================

        if (
            isFormData
        ) {

            delete config.headers[
                "Content-Type"
            ];

            delete config.headers[
                "content-type"
            ];
        }


        // =====================================================
        // AUTHORIZATION
        // =====================================================

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;
        }


        // =====================================================
        // REQUEST
        // =====================================================

        console.log(
            "API REQUEST:",
            {
                endpoint,
                method:
                    config.method,
                isFormData,
                hasToken:
                    Boolean(token),
            }
        );


        const response =
            await API.request(
                config
            );


        return response.data;


    } catch (error) {

        const message =
            error?.response
                ?.data
                ?.message ||

            error?.message ||

            "Có lỗi xảy ra khi gọi API";


        const apiError =
            new Error(
                message
            );


        apiError.status =
            error?.response
                ?.status;


        apiError.data =
            error?.response
                ?.data;


        throw apiError;
    }
};


export default apiClient;
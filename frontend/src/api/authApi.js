import apiClient from "./apiClient";


// ==========================================================
// LOGIN
// POST /api/auth/login
// ==========================================================

export const loginApi = async ({
    phone,
    password,
}) => {

    return apiClient(
        "/auth/login",
        {
            method: "POST",

            body: JSON.stringify({
                phone,
                password,
            }),
        }
    );
};


// ==========================================================
// REGISTER
// POST /api/auth/register
// ==========================================================

export const registerApi = async (
    data
) => {

    return apiClient(
        "/auth/register",
        {
            method: "POST",

            body: JSON.stringify({
                fullName:
                    data.fullName,

                phone:
                    data.phone,

                email:
                    data.email?.trim() ||
                    undefined,

                password:
                    data.password,
            }),
        }
    );
};


// ==========================================================
// PROFILE
// GET /api/auth/profile
// ==========================================================

export const getProfileApi = async () => {

    return apiClient(
        `/auth/profile?_=${Date.now()}`,
        {
            method: "GET",

            headers: {
                "Cache-Control":
                    "no-cache",

                "Pragma":
                    "no-cache",
            },
        }
    );
};


// ==========================================================
// UPDATE PROFILE
// PUT /api/auth/profile
// ==========================================================

export const updateProfileApi = async (
    data
) => {

    return apiClient(
        "/auth/profile",
        {
            method: "PUT",

            body: JSON.stringify({

                fullName:
                    data.fullName || "",

                // Gửi phone hiện tại
                // nhưng frontend khóa không cho sửa
                phone:
                    data.phone || "",

                email:
                    data.email || "",

                dateOfBirth:
                    data.dateOfBirth || "",

                gender:
                    data.gender || "",

                address:
                    data.address || "",
            }),
        }
    );
};
import apiClient from "../utils/apiClient";

// =============================
// GET ALL USERS
// =============================

export const getUsersApi = async () => {
    return await apiClient("/users", {
        method: "GET",
    });
};


// =============================
// CREATE STAFF
// =============================

export const createStaffApi = async (data) => {
    return await apiClient("/users", {
        method: "POST",
        body: data,
    });
};


// =============================
// DELETE USER
// =============================

export const deleteUserApi = async (id) => {
    return await apiClient(`/users/${id}`, {
        method: "DELETE",
    });
};


// =============================
// UPDATE USER
// =============================

export const updateUserApi = async (id, data) => {
    return await apiClient(`/users/${id}`, {
        method: "PUT",
        body: data,
    });
};
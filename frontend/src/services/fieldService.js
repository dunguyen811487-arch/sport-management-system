import apiClient from "../api/apiClient";

// ==========================================================
// GET ALL FIELDS
// ==========================================================

export const getFields = async () => {
    return apiClient("/fields", {
        method: "GET",
    });
};

// ==========================================================
// GET FIELD BY ID
// ==========================================================

export const getFieldById = async (id) => {
    if (!id) {
        throw new Error("Không xác định được ID sân.");
    }

    return apiClient(`/fields/${id}`, {
        method: "GET",
    });
};

// ==========================================================
// CREATE FIELD
// ==========================================================

export const createField = async (data) => {
    const formData = new FormData();

    formData.append(
        "fieldName",
        data.fieldName || ""
    );

    formData.append(
        "fieldTypeId",
        data.fieldTypeId || ""
    );

    formData.append(
        "location",
        data.location || ""
    );

    formData.append(
        "pricePerHour",
        String(data.pricePerHour ?? 0)
    );

    formData.append(
        "description",
        data.description || ""
    );

    formData.append(
        "status",
        data.status || "active"
    );

    // Chỉ gửi File thật
    if (data.image instanceof File) {
        formData.append(
            "image",
            data.image
        );
    }

    return apiClient("/fields", {
        method: "POST",
        body: formData,
    });
};

// ==========================================================
// UPDATE FIELD
// ==========================================================

export const updateField = async (
    id,
    data
) => {
    if (!id) {
        throw new Error(
            "Không xác định được ID sân."
        );
    }

    const formData = new FormData();

    formData.append(
        "fieldName",
        data.fieldName || ""
    );

    formData.append(
        "fieldTypeId",
        data.fieldTypeId || ""
    );

    formData.append(
        "location",
        data.location || ""
    );

    formData.append(
        "pricePerHour",
        String(data.pricePerHour ?? 0)
    );

    formData.append(
        "description",
        data.description || ""
    );

    formData.append(
        "status",
        data.status || "active"
    );

    // Có ảnh mới thì gửi ảnh
    // Không có thì backend giữ ảnh cũ
    if (data.image instanceof File) {
        formData.append(
            "image",
            data.image
        );
    }

    return apiClient(
        `/fields/${id}`,
        {
            method: "PUT",
            body: formData,
        }
    );
};

// ==========================================================
// DELETE FIELD
// ==========================================================

export const deleteField = async (
    id
) => {
    if (!id) {
        throw new Error(
            "Không xác định được ID sân."
        );
    }

    return apiClient(
        `/fields/${id}`,
        {
            method: "DELETE",
        }
    );
};
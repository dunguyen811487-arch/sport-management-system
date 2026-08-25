import apiClient from "./apiClient";


// ==========================================================
// BACKEND URL
// ==========================================================

const API_BASE_URL =
    "http://localhost:5000";


// ==========================================================
// NORMALIZE IMAGE URL
// ==========================================================
//
// MongoDB có thể lưu:
//
// /uploads/fields/field-xxx.jpg
//
// hoặc:
//
// uploads/fields/field-xxx.jpg
//
// hoặc đã là:
//
// http://localhost:5000/uploads/fields/xxx.jpg
//
// Hàm này chuẩn hóa về URL hoàn chỉnh.
// ==========================================================

const normalizeFieldImage = (
    image
) => {

    if (!image) {
        return "";
    }


    const value =
        String(image).trim();


    if (!value) {
        return "";
    }


    // ------------------------------------------------------
    // Đã là URL đầy đủ
    // ------------------------------------------------------

    if (
        value.startsWith(
            "http://"
        ) ||
        value.startsWith(
            "https://"
        )
    ) {

        return value;
    }


    // ------------------------------------------------------
    // /uploads/fields/...
    // ------------------------------------------------------

    if (
        value.startsWith(
            "/uploads/"
        )
    ) {

        return (
            `${API_BASE_URL}${value}`
        );
    }


    // ------------------------------------------------------
    // uploads/fields/...
    // ------------------------------------------------------

    if (
        value.startsWith(
            "uploads/"
        )
    ) {

        return (
            `${API_BASE_URL}/${value}`
        );
    }


    // ------------------------------------------------------
    // Trường hợp backend chỉ trả filename
    // ------------------------------------------------------

    if (
        value.startsWith(
            "field-"
        )
    ) {

        return (
            `${API_BASE_URL}/uploads/fields/${value}`
        );
    }


    return value;
};


// ==========================================================
// NORMALIZE FIELD
// ==========================================================

const normalizeField = (
    field
) => {

    if (!field) {
        return field;
    }


    return {
        ...field,

        image:
            normalizeFieldImage(
                field.image
            ),
    };
};


// ==========================================================
// GET ALL FIELDS
// GET /api/fields
// ==========================================================

export const getFieldsApi =
    async () => {

        const response =
            await apiClient(
                "/fields",
                {
                    method: "GET",
                }
            );


        if (
            !Array.isArray(
                response
            )
        ) {

            return [];
        }


        return response.map(
            normalizeField
        );
    };


// ==========================================================
// ALIAS
// ==========================================================

export const getAllFieldsApi =
    getFieldsApi;


// ==========================================================
// GET FIELD BY ID
// GET /api/fields/:id
// ==========================================================

export const getFieldApi =
    async (
        id
    ) => {

        if (!id) {

            throw new Error(
                "Không xác định được ID sân."
            );
        }


        const response =
            await apiClient(
                `/fields/${id}`,
                {
                    method: "GET",
                }
            );


        return normalizeField(
            response
        );
    };


// ==========================================================
// CREATE FIELD
// POST /api/fields
// ==========================================================

export const createFieldApi =
    async (
        data
    ) => {

        const formData =
            new FormData();


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
            String(
                data.pricePerHour ?? 0
            )
        );


        formData.append(
            "description",
            data.description || ""
        );


        formData.append(
            "status",
            data.status || "active"
        );


        // ------------------------------------------------------
        // ẢNH
        // ------------------------------------------------------

        if (
            data.image instanceof File
        ) {

            formData.append(
                "image",
                data.image
            );
        }


        const response =
            await apiClient(
                "/fields",
                {
                    method:
                        "POST",

                    body:
                        formData,
                }
            );


        return normalizeField(
            response
        );
    };


// ==========================================================
// UPDATE FIELD
// PUT /api/fields/:id
// ==========================================================

export const updateFieldApi =
    async (
        id,
        data
    ) => {

        if (!id) {

            throw new Error(
                "Không xác định được ID sân."
            );
        }


        const formData =
            new FormData();


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
            String(
                data.pricePerHour ?? 0
            )
        );


        formData.append(
            "description",
            data.description || ""
        );


        formData.append(
            "status",
            data.status || "active"
        );


        // ------------------------------------------------------
        // Nếu chọn ảnh mới
        // ------------------------------------------------------

        if (
            data.image instanceof File
        ) {

            formData.append(
                "image",
                data.image
            );
        }


        const response =
            await apiClient(
                `/fields/${id}`,
                {
                    method:
                        "PUT",

                    body:
                        formData,
                }
            );


        return normalizeField(
            response
        );
    };


// ==========================================================
// DELETE FIELD
// DELETE /api/fields/:id
// ==========================================================

export const deleteFieldApi =
    async (
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
                method:
                    "DELETE",
            }
        );
    };
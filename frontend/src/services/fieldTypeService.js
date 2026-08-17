const API_BASE_URL = "http://localhost:5000/api";

// ==========================================
// LẤY DANH SÁCH LOẠI SÂN
// GET /api/field-types
// ==========================================

export const getFieldTypes = async () => {
  const response = await fetch(
    `${API_BASE_URL}/field-types`
  );

  if (!response.ok) {
    throw new Error(
      "Không thể lấy danh sách loại sân"
    );
  }

  return response.json();
};


// ==========================================
// THÊM LOẠI SÂN
// POST /api/field-types
// ==========================================

export const createFieldType = async (
  fieldTypeData
) => {
  const response = await fetch(
    `${API_BASE_URL}/field-types`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(fieldTypeData),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Không thể tạo loại sân"
    );
  }

  return response.json();
};


// ==========================================
// CẬP NHẬT LOẠI SÂN
// PUT /api/field-types/:id
// ==========================================

export const updateFieldType = async (
  id,
  fieldTypeData
) => {
  const response = await fetch(
    `${API_BASE_URL}/field-types/${id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(fieldTypeData),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Không thể cập nhật loại sân"
    );
  }

  return response.json();
};


// ==========================================
// XÓA LOẠI SÂN
// DELETE /api/field-types/:id
// ==========================================

export const deleteFieldType = async (
  id
) => {
  const response = await fetch(
    `${API_BASE_URL}/field-types/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Không thể xóa loại sân"
    );
  }

  return response.json();
};
// src/services/fieldTypeService.js

import API from "../config/api";

const fieldTypeService = {

  // Danh sách loại sân
  getAll() {
    return API.get("/field-types");
  },

  // Chi tiết loại sân
  getById(id) {
    return API.get(`/field-types/${id}`);
  },

  // Thêm loại sân
  create(data) {
    return API.post("/field-types", data);
  },

  // Cập nhật loại sân
  update(id, data) {
    return API.put(`/field-types/${id}`, data);
  },

  // Xóa loại sân
  remove(id) {
    return API.delete(`/field-types/${id}`);
  },

};

export default fieldTypeService;
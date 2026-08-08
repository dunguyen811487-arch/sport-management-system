// src/services/fieldService.js

import API from "../config/api";

const fieldService = {

  // Lấy danh sách sân
  getAll() {
    return API.get("/fields");
  },

  // Lấy chi tiết sân
  getById(id) {
    return API.get(`/fields/${id}`);
  },

  // Thêm sân
  create(data) {
    return API.post("/fields", data);
  },

  // Cập nhật sân
  update(id, data) {
    return API.put(`/fields/${id}`, data);
  },

  // Xóa sân
  remove(id) {
    return API.delete(`/fields/${id}`);
  },

};

export default fieldService;
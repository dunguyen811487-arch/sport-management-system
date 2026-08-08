// src/services/paymentService.js

import API from "../config/api";

const paymentService = {

  // Danh sách thanh toán
  getAll() {
    return API.get("/payments");
  },

  // Chi tiết thanh toán
  getById(id) {
    return API.get(`/payments/${id}`);
  },

  // Thanh toán
  create(data) {
    return API.post("/payments", data);
  },

  // Cập nhật
  update(id, data) {
    return API.put(`/payments/${id}`, data);
  },

  // Xóa
  remove(id) {
    return API.delete(`/payments/${id}`);
  },

};

export default paymentService; 
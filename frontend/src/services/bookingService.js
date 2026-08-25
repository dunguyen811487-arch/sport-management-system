// src/services/bookingService.js

import API from "../config/api";

const bookingService = {

  // Danh sách đặt sân
  getAll() {
    return API.get("/bookings");
  },

  // Chi tiết đặt sân
  getById(id) {
    return API.get(`/bookings/${id}`);
  },

  // Đặt sân
  create(data) {
    return API.post("/bookings", data);
  },

  // Cập nhật
  update(id, data) {
    return API.put(`/bookings/${id}`, data);
  },

  // Hủy đặt sân
  remove(id) {
    return API.delete(`/bookings/${id}`);
  },

};

export default bookingService;
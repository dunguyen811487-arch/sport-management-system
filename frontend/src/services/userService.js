// src/services/userService.js

import API from "../config/api";

const userService = {

  // Lấy danh sách người dùng (Admin)
  getAll() {
    return API.get("/users");
  },

  // Lấy thông tin người dùng theo ID
  getById(id) {
    return API.get(`/users/${id}`);
  },

  // Lấy thông tin người dùng hiện tại
  getProfile() {
    return API.get("/users/profile");
  },

  // Tạo người dùng mới
  create(data) {
    return API.post("/users", data);
  },

  // Cập nhật thông tin
  update(id, data) {
    return API.put(`/users/${id}`, data);
  },

  // Đổi mật khẩu
  changePassword(data) {
    return API.put("/users/change-password", data);
  },

  // Xóa người dùng
  remove(id) {
    return API.delete(`/users/${id}`);
  },

};

export default userService;
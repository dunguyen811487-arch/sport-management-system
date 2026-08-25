// src/services/authService.js

import API from "../config/api";

const authService = {

  // Đăng nhập
  login(data) {
    return API.post("/auth/login", data);
  },

  // Đăng ký
  register(data) {
    return API.post("/auth/register", data);
  },

  // Lấy thông tin người dùng
  getProfile() {
    return API.get("/users/profile");
  },

  // Đổi mật khẩu
  changePassword(data) {
    return API.put("/users/change-password", data);
  },

  // Đăng xuất
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

};

export default authService;
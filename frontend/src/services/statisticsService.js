// src/services/statisticsService.js

import API from "../config/api";

const statisticsService = {

  // Thống kê tổng quan
  getDashboard() {
    return API.get("/statistics/dashboard");
  },

  // Doanh thu
  getRevenue() {
    return API.get("/statistics/revenue");
  },

  // Lượt đặt sân
  getBookings() {
    return API.get("/statistics/bookings");
  },

  // Thống kê sân
  getFields() {
    return API.get("/statistics/fields");
  },

  // Top sân được đặt nhiều
  getTopFields() {
    return API.get("/statistics/top-fields");
  },

};

export default statisticsService;
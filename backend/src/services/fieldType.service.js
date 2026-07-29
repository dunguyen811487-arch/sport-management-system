const FieldType = require("../models/fieldType.model");

// Lấy tất cả loại sân
const getAllFieldTypes = async () => {
  return await FieldType.find();
};

// Thêm loại sân
const createFieldType = async (data) => {
  return await FieldType.create(data);
};

// Cập nhật loại sân
const updateFieldType = async (id, data) => {
  return await FieldType.findByIdAndUpdate(id, data, {
    new: true,
  });
};

// Xóa loại sân
const deleteFieldType = async (id) => {
  return await FieldType.findByIdAndDelete(id);
};

module.exports = {
  getAllFieldTypes,
  createFieldType,
  updateFieldType,
  deleteFieldType,
};
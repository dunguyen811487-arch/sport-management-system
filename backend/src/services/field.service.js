const Field = require("../models/field.model");

// Lấy tất cả sân
const getAllFields = async () => {
    return await Field.find().populate("fieldTypeId");
};

// Tạo sân mới
const createField = async (fieldData) => {
    return await Field.create(fieldData);
};

module.exports = {
    getAllFields,
    createField,
};
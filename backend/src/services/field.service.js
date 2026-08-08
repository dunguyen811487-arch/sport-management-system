const Field = require("../models/field.model");

const createField = async (data) => {
    return await Field.create(data);
};

const getAllFields = async () => {
    return await Field.find().populate("fieldTypeId");
};

const getFieldById = async (id) => {
    return await Field.findById(id).populate("fieldTypeId");
};

const updateField = async (id, data) => {
    return await Field.findByIdAndUpdate(
        id,
        data,
        { new: true }
    );
};

const deleteField = async (id) => {
    return await Field.findByIdAndDelete(id);
};

module.exports = {
    createField,
    getAllFields,
    getFieldById,
    updateField,
    deleteField
};
const FieldType = require("../models/fieldType.model");

const createFieldType = async (data) => {
    return await FieldType.create(data);
};

const getAllFieldTypes = async () => {
    return await FieldType.find();
};

const getFieldTypeById = async (id) => {
    return await FieldType.findById(id);
};

const updateFieldType = async (id, data) => {
    return await FieldType.findByIdAndUpdate(
        id,
        data,
        { new: true }
    );
};

const deleteFieldType = async (id) => {
    return await FieldType.findByIdAndDelete(id);
};

module.exports = {
    createFieldType,
    getAllFieldTypes,
    getFieldTypeById,
    updateFieldType,
    deleteFieldType
};
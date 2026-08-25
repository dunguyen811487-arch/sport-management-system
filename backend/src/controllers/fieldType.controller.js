const fieldTypeService = require("../services/fieldType.service");

// CREATE
const createFieldType = async (req, res) => {
    try {
        const fieldType = await fieldTypeService.createFieldType(req.body);

        res.status(201).json(fieldType);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// GET ALL
const getAllFieldTypes = async (req, res) => {
    try {
        const fieldTypes = await fieldTypeService.getAllFieldTypes();

        res.json(fieldTypes);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// GET BY ID
const getFieldTypeById = async (req, res) => {
    try {
        const fieldType = await fieldTypeService.getFieldTypeById(
            req.params.id
        );

        if (!fieldType) {
            return res.status(404).json({
                message: "Field type not found"
            });
        }

        res.json(fieldType);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// UPDATE
const updateFieldType = async (req, res) => {
    try {
        const fieldType = await fieldTypeService.updateFieldType(
            req.params.id,
            req.body
        );

        res.json(fieldType);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// DELETE
const deleteFieldType = async (req, res) => {
    try {
        await fieldTypeService.deleteFieldType(req.params.id);

        res.json({
            message: "Deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createFieldType,
    getAllFieldTypes,
    getFieldTypeById,
    updateFieldType,
    deleteFieldType
};
const fieldService = require("../services/field.service");

// CREATE
const createField = async (req, res) => {
    try {
        const field = await fieldService.createField(req.body);

        res.status(201).json(field);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// GET ALL
const getAllFields = async (req, res) => {
    try {
        const fields = await fieldService.getAllFields();

        res.json(fields);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// GET BY ID
const getFieldById = async (req, res) => {
    try {
        const field = await fieldService.getFieldById(req.params.id);

        if (!field) {
            return res.status(404).json({
                message: "Field not found"
            });
        }

        res.json(field);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// UPDATE
const updateField = async (req, res) => {
    try {
        const field = await fieldService.updateField(
            req.params.id,
            req.body
        );

        res.json(field);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// DELETE
const deleteField = async (req, res) => {
    try {
        await fieldService.deleteField(req.params.id);

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
    createField,
    getAllFields,
    getFieldById,
    updateField,
    deleteField
};
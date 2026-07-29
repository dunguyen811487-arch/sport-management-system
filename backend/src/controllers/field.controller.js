const fieldService = require("../services/field.service");

// GET /api/fields
const getAllFields = async (req, res) => {
    try {
        const fields = await fieldService.getAllFields();
        res.json(fields);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// POST /api/fields
const createField = async (req, res) => {
    try {
        const field = await fieldService.createField(req.body);
        res.status(201).json(field);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    getAllFields,
    createField,
};
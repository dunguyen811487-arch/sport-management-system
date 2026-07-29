const fieldTypeService = require("../services/fieldType.service");

// GET
const getAllFieldTypes = async (req, res) => {
  try {
    const result = await fieldTypeService.getAllFieldTypes();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST
const createFieldType = async (req, res) => {
  try {
    const result = await fieldTypeService.createFieldType(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT
const updateFieldType = async (req, res) => {
  try {
    const result = await fieldTypeService.updateFieldType(
      req.params.id,
      req.body
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
const deleteFieldType = async (req, res) => {
  try {
    await fieldTypeService.deleteFieldType(req.params.id);

    res.json({
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllFieldTypes,
  createFieldType,
  updateFieldType,
  deleteFieldType,
};
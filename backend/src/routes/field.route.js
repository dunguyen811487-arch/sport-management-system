const express = require("express");

const router = express.Router();

const fieldController = require("../controllers/field.controller");

// CREATE
router.post("/", fieldController.createField);

// GET ALL
router.get("/", fieldController.getAllFields);

// GET BY ID
router.get("/:id", fieldController.getFieldById);

// UPDATE
router.put("/:id", fieldController.updateField);

// DELETE
router.delete("/:id", fieldController.deleteField);

module.exports = router;
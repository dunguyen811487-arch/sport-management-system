const express = require("express");

const router = express.Router();

const fieldTypeController = require("../controllers/fieldType.controller");

// CREATE
router.post("/", fieldTypeController.createFieldType);

// GET ALL
router.get("/", fieldTypeController.getAllFieldTypes);

// GET BY ID
router.get("/:id", fieldTypeController.getFieldTypeById);

// UPDATE
router.put("/:id", fieldTypeController.updateFieldType);

// DELETE
router.delete("/:id", fieldTypeController.deleteFieldType);

module.exports = router;
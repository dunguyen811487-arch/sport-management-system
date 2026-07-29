const express = require("express");

const router = express.Router();

const fieldTypeController = require("../controllers/fieldType.controller");

router.get("/", fieldTypeController.getAllFieldTypes);

router.post("/", fieldTypeController.createFieldType);

router.put("/:id", fieldTypeController.updateFieldType);

router.delete("/:id", fieldTypeController.deleteFieldType);

module.exports = router;
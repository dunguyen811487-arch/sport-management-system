const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const fieldRoute = require("./routes/field.route");
const fieldTypeRoute = require("./routes/fieldType.route");

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/field-types", fieldTypeRoute);

app.use("/api/fields", fieldRoute);

app.get("/", (req, res) => {
    res.json({
        message: "Sport Management API"
    });
});

module.exports = app;
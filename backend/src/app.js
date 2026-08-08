const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const fieldTypeRoute = require("./routes/fieldType.route");
const fieldRoute = require("./routes/field.route");
const bookingRoute = require("./routes/booking.route");
const paymentRoute = require("./routes/payment.route");
const authRoute = require("./routes/auth.route");


const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/field-types", fieldTypeRoute);
app.use("/api/fields", fieldRoute);
app.use("/api/bookings", bookingRoute);
app.use("/api/payments", paymentRoute);
app.use("/api/auth", authRoute);


app.use("/api/fields", fieldRoute);

app.get("/", (req, res) => {
    res.json({
        message: "Sport Management API"
    });
});

module.exports = app;
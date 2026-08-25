const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

const fieldTypeRoute =
    require("./routes/fieldType.route");

const fieldRoute =
    require("./routes/field.route");

const bookingRoute =
    require("./routes/booking.route");

const paymentRoute =
    require("./routes/payment.route");

const authRoute =
    require("./routes/auth.route");

const userRoute =
    require("./routes/user.route");

const reportRoute =
    require("./routes/report.route");


const {
    swaggerSpec,
    swaggerUi
} = require("./swagger/swagger");


const app = express();


// ==========================================================
// MIDDLEWARE
// ==========================================================

// CORS
app.use(
    cors()
);


// ==========================================================
// HELMET
// ==========================================================
//
// Cho phép frontend khác origin như:
// http://localhost:3000
//
// truy cập resource ảnh:
// http://localhost:5000/uploads/...
//
// ==========================================================

app.use(
    helmet({
        crossOriginResourcePolicy: {
            policy: "cross-origin"
        }
    })
);


// LOG
app.use(
    morgan("dev")
);


// JSON
app.use(
    express.json()
);


// ==========================================================
// STATIC UPLOADS
// ==========================================================

app.use(
    "/uploads",
    express.static(
        path.join(
            __dirname,
            "../uploads"
        )
    )
);


// ==========================================================
// API
// ==========================================================

// FIELD TYPES
app.use(
    "/api/field-types",
    fieldTypeRoute
);


// FIELDS
app.use(
    "/api/fields",
    fieldRoute
);


// BOOKINGS
app.use(
    "/api/bookings",
    bookingRoute
);


// PAYMENTS
app.use(
    "/api/payments",
    paymentRoute
);


// AUTH
app.use(
    "/api/auth",
    authRoute
);


// USERS
app.use(
    "/api/users",
    userRoute
);


// REPORTS
// ----------------------------------------------------------
// POST /api/reports
// GET  /api/reports
// GET  /api/reports/:id
// DELETE /api/reports/:id
// ----------------------------------------------------------

app.use(
    "/api/reports",
    reportRoute
);


// ==========================================================
// SWAGGER
// ==========================================================

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(
        swaggerSpec
    )
);


// ==========================================================
// ROOT
// ==========================================================

app.get(
    "/",
    (req, res) => {

        res.json({
            message:
                "Sport Management API"
        });

    }
);


module.exports = app;
require("dotenv").config();

const path = require("path");

const app = require("./app");

const connectDB =
    require("./configs/database");


// ==========================================================
// CONNECT MONGODB
// ==========================================================

connectDB();


// ==========================================================
// PORT
// ==========================================================

const PORT =
    process.env.PORT || 5000;


// ==========================================================
// STATIC UPLOADS
// ==========================================================
//
// Cho phép frontend truy cập:
//
// http://localhost:5000/uploads/fields/xxx.jpg
//
// File thật nằm tại:
//
// backend/uploads/fields/xxx.jpg
//
// ==========================================================

app.use(
    "/uploads",
    require("express").static(
        path.join(
            __dirname,
            "../uploads"
        )
    )
);


// ==========================================================
// ROUTES
// ==========================================================
//
// Các route phải được đăng ký
// TRƯỚC app.listen()
// ==========================================================

const fieldRoutes =
    require("./routes/field.route");

app.use(
    "/api/fields",
    fieldRoutes
);


// ==========================================================
// START SERVER
// ==========================================================

app.listen(
    PORT,
    () => {

        console.log(
            `Server is running on port ${PORT}`
        );

    }
);
const express =
    require("express");

const router =
    express.Router();


const reportController =
    require(
        "../controllers/report.controller"
    );


const {
    authenticate,
    authorize
} =
    require(
        "../middlewares/auth.middleware"
    );


// ======================================================
// ADMIN + STAFF
// ======================================================

// ------------------------------------------------------
// TẠO BÁO CÁO
// POST /api/reports
// ------------------------------------------------------

router.post(
    "/",
    authenticate,
    authorize(
        "staff",
        "admin"
    ),
    reportController.createReport
);


// ------------------------------------------------------
// XEM TẤT CẢ BÁO CÁO
// GET /api/reports
// ------------------------------------------------------

router.get(
    "/",
    authenticate,
    authorize(
        "staff",
        "admin"
    ),
    reportController.getAllReports
);


// ------------------------------------------------------
// XEM CHI TIẾT
// GET /api/reports/:id
// ------------------------------------------------------

router.get(
    "/:id",
    authenticate,
    authorize(
        "staff",
        "admin"
    ),
    reportController.getReportById
);


// ======================================================
// ADMIN
// ======================================================

// ------------------------------------------------------
// XÓA BÁO CÁO
// DELETE /api/reports/:id
// ------------------------------------------------------

router.delete(
    "/:id",
    authenticate,
    authorize(
        "admin"
    ),
    reportController.deleteReport
);


module.exports =
    router;
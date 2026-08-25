const multer = require("multer");
const path = require("path");
const fs = require("fs");


// =============================
// UPLOAD DIRECTORY
// =============================

const uploadDir = path.join(
    __dirname,
    "../../uploads/fields"
);


// Tự tạo folder nếu chưa tồn tại

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(
        uploadDir,
        {
            recursive: true
        }
    );
}


// =============================
// STORAGE
// =============================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {

        const ext =
            path.extname(file.originalname);

        const filename =
            `field-${Date.now()}${ext}`;

        cb(null, filename);
    }

});


// =============================
// FILE FILTER
// =============================

const fileFilter = (
    req,
    file,
    cb
) => {

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/jpg"
    ];

    if (
        allowedTypes.includes(
            file.mimetype
        )
    ) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Chỉ được upload file ảnh JPG, JPEG, PNG hoặc WEBP"
            ),
            false
        );
    }

};


// =============================
// MULTER
// =============================

const upload = multer({

    storage,

    fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024
    }

});


module.exports = upload;
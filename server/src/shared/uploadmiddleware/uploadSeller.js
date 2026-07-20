const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create uploads/sellers folder if it doesn't exist
const uploadPath = path.join(__dirname, "../../uploads/sellers");

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({

    destination(req, file, cb) {
        cb(null, uploadPath);
    },

    filename(req, file, cb) {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9);

        cb(
            null,
            uniqueName + path.extname(file.originalname)
        );
    },
});

// File Filter
const fileFilter = (req, file, cb) => {

    const allowedTypes = /jpg|jpeg|png|webp/;

    const extension = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );

    const mimeType = allowedTypes.test(file.mimetype);

    if (extension && mimeType) {
        return cb(null, true);
    }

    cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed."));
};

const uploadSeller = multer({

    storage,

    fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024,
    },

});

module.exports = uploadSeller;
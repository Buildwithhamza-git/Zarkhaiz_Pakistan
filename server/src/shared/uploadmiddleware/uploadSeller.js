const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../../config/cloudinary");

// Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {

    let folder = "sellers/misc";

    // 📂 organize uploads
    if (file.fieldname === "logo") {
      folder = "sellers/logos";
    }

    if (
      file.fieldname === "cnicFront" ||
      file.fieldname === "cnicBack"
    ) {
      folder = "sellers/documents";
    }

    return {
      folder,
      allowed_formats: ["jpg", "jpeg", "png", "webp", "pdf"],
      public_id:
        Date.now() + "-" + file.originalname.split(".")[0],
    };
  },
});

// Multer config
const uploadSeller = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

module.exports = uploadSeller;
import multer from "multer";

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ["image/jpeg", "image/png"];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid image type. Only JPG and PNG images are allowed."));
    }
};

const upload = multer({ storage: multer.memoryStorage(), fileFilter });

export default upload;

import multer from "multer"
import path from 'path';

const fileExtensions = ["jpeg", "jpg", "png", "gif", "txt", "docx", "pdf", "xlsx"];
const allowedMimeTypes = new Set(
    ["image/jpeg",
    "image/jpeg",
   "image/png",
    "image/gif",
    "application/pdf",
    "text/plain",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]
);

const fileFilter = (req, file, cb) => {
    // 1. Create a regex string (e.g., "jpeg|jpg|png|gif|txt|docx|pdf|xlsx")
    const extensionRegexString = fileExtensions.join('|');
    const allowedTypes = new RegExp(extensionRegexString);

    // 2. Extract and check the extension (removing the leading dot)
    const fileExt = path.extname(file.originalname).toLowerCase().replace('.', '');
    const extName = allowedTypes.test(fileExt);
    
    // 3. Check the MIME type (checks if the type string contains any allowed extension)
    const mimeType = allowedMimeTypes.has(file.mimetype);
    
    
    if (extName && mimeType) {
        return cb(null, true);
    } else {
        cb(new Error(`Only allowed formats: ${fileExtensions.join(', ')}`));
    }
};


const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB file limit
    fileFilter: fileFilter
});

export default upload
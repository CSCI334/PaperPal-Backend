import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const name = Date.now() + Math.round(Math.random() * 1E9);
        cb(null, name + path.extname(file.originalname));
    }
});
export const upload = multer({ 
    storage: storage
});
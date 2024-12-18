import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve absolute path for the upload directory
const tempDir = path.join(__dirname, "../../public/temp");

// Ensure the directory exists
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempDir); 
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// Export multer upload middleware
export const upload = multer({ storage });
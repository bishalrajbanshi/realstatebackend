import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";


//define dirname 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//resolve the path and upload to dir
const tempDir = path.join(__dirname, "../../../public/temp");

// Ensure the directory exists
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

// Function to generate a random 6-character string with letters and digits
const generateRandomString = () => {
    return Math.random().toString(36).substr(2, 6).toLowerCase(); 
};

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempDir); 
    },
    filename: (req, file, cb) => {
        const randomString = generateRandomString();
        const fileExtension = path.extname(file.originalname); 
        const fileName = `${randomString}${fileExtension}`;
        cb(null, fileName);
    },
});

export const upload = multer({ storage });
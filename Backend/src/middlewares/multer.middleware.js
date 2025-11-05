import multer from "multer";
import path from "path"
import { v4 as uuid } from "uuid"
import fs from "fs"

const tempDir = path.join(process.cwd(), "public", "temp");
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tempDir)
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, `${uuid()}${ext}`);
    },
});


export const upload = multer({
    storage,
});
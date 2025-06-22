import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp"); // ✅ File is saved here
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // ⚠️ Consider adding timestamp to avoid overwriting
    }
});

export const upload = multer({ storage });

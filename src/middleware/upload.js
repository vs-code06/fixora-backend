import multer from "multer";

const storage = multer.diskStorage({});
// no destination → multer stores temp file for cloudinary

const upload = multer({ storage });

export default upload;

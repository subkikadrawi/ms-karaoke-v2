import multer from 'multer';
import path from 'path';
import fs from 'fs';

const dirPath = (): string => {
  const uploadDir = path.join(process.cwd(), '/uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {recursive: true});
  }

  return uploadDir;
};

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, dirPath());
  },
  filename: function (_req, file, cb) {
    const uniqueName = `mslik_${Date.now()}_${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({storage});
export default upload;

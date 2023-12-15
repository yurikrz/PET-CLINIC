import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadSingle = (fileName) => upload.single(fileName);

export const uploadArr = (fileName, maxFileNumber) =>
  upload.array(fileName, maxFileNumber);

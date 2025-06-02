import multer from 'multer';

const storage = multer.memoryStorage(); // เก็บไฟล์ใน RAM เพื่อส่งต่อไป Cloudinary
const unpackFormData = multer({ storage });
export default unpackFormData;
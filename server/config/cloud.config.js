import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
    CLOUD_NAME : process.env.CLOUD_NAME,
    CLOUD_PUBLIC_KEY : process.env.CLOUD_PUBLIC_KEY,
    CLOUD_SECRET_KEY : process.env.CLOUD_PUBLIC_KEY
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads',
        allowed_formats: ['pdf, mp4, jpg, png, jpeg']
    }
});

const upload = multer({ storage });

export default upload
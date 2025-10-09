import multer from 'multer';
import path from 'path';
import { NextRequest } from 'next/server';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'public', 'uploads'));
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to allow only images
const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Configure multer
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

// Helper function to handle file upload
export const handleFileUpload = (req: NextRequest) => {
  return new Promise((resolve, reject) => {
    upload.single('image')(req as any, {} as any, (err: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(req);
      }
    });
  });
};

// Generate public URL for uploaded file
export const getPublicUrl = (filename: string) => {
  return `/uploads/${filename}`;
};

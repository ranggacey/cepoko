import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'your-cloud-name',
  api_key: process.env.CLOUDINARY_API_KEY || '615334282652891',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'IdoZWw9nuf-1J27Wqh8hMyXjmHs',
});

export default cloudinary;

export const uploadToCloudinary = async (file: File): Promise<string> => {
  try {
    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'cepoko', // Folder di Cloudinary
      resource_type: 'auto',
      transformation: [
        { width: 1920, height: 1080, crop: 'limit' }, // Max resolution
        { quality: 'auto:good' }, // Auto quality optimization
        { fetch_format: 'auto' }, // Auto format (WebP jika support)
      ],
    });

    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};


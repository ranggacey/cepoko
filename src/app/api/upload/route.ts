import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Check if we should use Cloudinary (default for production)
const useCloudinary = process.env.USE_CLOUDINARY !== 'false';

export async function POST(request: NextRequest) {
  try {
    console.log('Upload API called, useCloudinary:', useCloudinary);
    
    const data = await request.formData();
    const file: File | null = data.get('image') as unknown as File;

    console.log('File received:', file ? file.name : 'No file');

    if (!file) {
      console.error('No file in request');
      return NextResponse.json({ 
        success: false,
        error: 'No file uploaded' 
      }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error('Invalid file type:', file.type);
      return NextResponse.json({ 
        success: false,
        error: 'Only image files are allowed' 
      }, { status: 400 });
    }

    // Validate file size (10MB limit for Cloudinary)
    if (file.size > 10 * 1024 * 1024) {
      console.error('File too large:', file.size);
      return NextResponse.json({ 
        success: false,
        error: 'File size must be less than 10MB' 
      }, { status: 400 });
    }

    let publicUrl: string;
    let storageType: string;

    if (useCloudinary) {
      // Use Cloudinary (default for production)
      console.log('Using Cloudinary storage');
      
      try {
        publicUrl = await uploadToCloudinary(file);
        storageType = 'cloudinary';
        console.log('File uploaded to Cloudinary:', publicUrl);
      } catch (cloudinaryError: any) {
        console.error('Cloudinary upload failed:', cloudinaryError);
        throw new Error('Failed to upload to Cloudinary: ' + cloudinaryError.message);
      }
    } else {
      // Use local filesystem (only for local development)
      console.log('Using local filesystem storage');
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const extension = path.extname(file.name);
      const filename = `image-${timestamp}-${randomString}${extension}`;

      // Ensure uploads directory exists
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!existsSync(uploadsDir)) {
        console.log('Creating uploads directory');
        await mkdir(uploadsDir, { recursive: true });
      }

      // Save file to uploads directory
      const uploadPath = path.join(uploadsDir, filename);
      console.log('Saving file to:', uploadPath);
      await writeFile(uploadPath, buffer);
      console.log('File saved successfully to local filesystem');

      publicUrl = `/uploads/${filename}`;
      storageType = 'local';
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      originalName: file.name,
      size: file.size,
      type: file.type,
      storage: storageType
    });

  } catch (error: any) {
    console.error('Error uploading file:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to upload file',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

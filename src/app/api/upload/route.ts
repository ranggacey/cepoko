import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Check if running on Vercel
const isVercel = process.env.VERCEL === '1';

export async function POST(request: NextRequest) {
  try {
    console.log('Upload API called, isVercel:', isVercel);
    
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

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      console.error('File too large:', file.size);
      return NextResponse.json({ 
        success: false,
        error: 'File size must be less than 5MB' 
      }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = path.extname(file.name);
    const filename = `image-${timestamp}-${randomString}${extension}`;

    let publicUrl: string;

    if (isVercel && process.env.BLOB_READ_WRITE_TOKEN) {
      // Use Vercel Blob Storage in production
      console.log('Using Vercel Blob Storage');
      
      try {
        const blob = await put(filename, file, {
          access: 'public',
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });

        publicUrl = blob.url;
        console.log('File uploaded to Vercel Blob:', publicUrl);
      } catch (blobError: any) {
        console.error('Vercel Blob upload failed:', blobError);
        throw new Error('Failed to upload to cloud storage: ' + blobError.message);
      }
    } else {
      // Use local filesystem in development
      console.log('Using local filesystem storage');
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

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
    }

    return NextResponse.json({
      success: true,
      filename: filename,
      url: publicUrl,
      originalName: file.name,
      size: file.size,
      type: file.type,
      storage: isVercel && process.env.BLOB_READ_WRITE_TOKEN ? 'vercel-blob' : 'local'
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

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    console.log('Upload API called');
    
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
    console.log('File saved successfully');

    // Return public URL
    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      filename: filename,
      url: publicUrl,
      originalName: file.name,
      size: file.size,
      type: file.type
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

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Gallery from '@/models/Gallery';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function generateUniqueSlug(title: string, excludeId?: string): Promise<string> {
  let baseSlug = generateSlug(title);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const query: any = { slug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    
    const existingGallery = await Gallery.findOne(query);
    if (!existingGallery) {
      break;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const gallery = await Gallery.findById(id)
      .populate('uploadedBy', 'name email')
      .lean();

    if (!gallery) {
      return NextResponse.json(
        { error: 'Gallery not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(gallery);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { id } = await params;
    
    // Generate slug if title is being updated and slug is not provided
    if (body.title && !body.slug) {
      body.slug = await generateUniqueSlug(body.title, id);
    }
    
    const gallery = await Gallery.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!gallery) {
      return NextResponse.json(
        { error: 'Gallery not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(gallery);
  } catch (error) {
    console.error('Error updating gallery:', error);
    return NextResponse.json(
      { error: 'Failed to update gallery' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const gallery = await Gallery.findByIdAndDelete(id);

    if (!gallery) {
      return NextResponse.json(
        { error: 'Gallery not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Gallery deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery:', error);
    return NextResponse.json(
      { error: 'Failed to delete gallery' },
      { status: 500 }
    );
  }
}

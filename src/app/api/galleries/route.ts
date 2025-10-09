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

async function generateUniqueSlug(title: string): Promise<string> {
  let baseSlug = generateSlug(title);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existingGallery = await Gallery.findOne({ slug });
    if (!existingGallery) {
      break;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const published = searchParams.get('published');

    let query: any = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (published !== null) {
      query.published = published === 'true';
    }

    const galleries = await Gallery.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(galleries);
  } catch (error) {
    console.error('Error fetching galleries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch galleries' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Generate slug if not provided
    if (!body.slug && body.title) {
      body.slug = await generateUniqueSlug(body.title);
    }
    
    const gallery = new Gallery(body);
    await gallery.save();

    return NextResponse.json(gallery, { status: 201 });
  } catch (error) {
    console.error('Error creating gallery:', error);
    return NextResponse.json(
      { error: 'Failed to create gallery' },
      { status: 500 }
    );
  }
}

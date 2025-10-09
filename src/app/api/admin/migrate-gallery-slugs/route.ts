import { NextResponse } from 'next/server';
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

export async function POST() {
  try {
    await connectDB();

    // Find all galleries without slug
    const galleriesWithoutSlug = await Gallery.find({ 
      $or: [
        { slug: { $exists: false } },
        { slug: null },
        { slug: '' }
      ]
    });

    console.log(`Found ${galleriesWithoutSlug.length} galleries without slug`);

    const results = [];

    for (const gallery of galleriesWithoutSlug) {
      try {
        const slug = await generateUniqueSlug(gallery.title);
        await Gallery.findByIdAndUpdate(gallery._id, { slug });
        
        results.push({
          id: gallery._id,
          title: gallery.title,
          slug: slug
        });
        
        console.log(`Updated gallery: ${gallery.title} -> ${slug}`);
      } catch (error) {
        console.error(`Error updating gallery ${gallery._id}:`, error);
        results.push({
          id: gallery._id,
          title: gallery.title,
          error: error.message
        });
      }
    }

    return NextResponse.json({
      message: 'Gallery slugs migration completed',
      processed: galleriesWithoutSlug.length,
      results: results
    });

  } catch (error) {
    console.error('Error migrating gallery slugs:', error);
    return NextResponse.json(
      { error: 'Failed to migrate gallery slugs' },
      { status: 500 }
    );
  }
}

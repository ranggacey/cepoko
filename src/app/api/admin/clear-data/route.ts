import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Location from '@/models/Location';
import Gallery from '@/models/Gallery';
import Article from '@/models/Article';

export async function DELETE() {
  try {
    await connectDB();

    // Clear all data except admin user
    const [locationsResult, galleriesResult, articlesResult] = await Promise.all([
      Location.deleteMany({}),
      Gallery.deleteMany({}),
      Article.deleteMany({})
    ]);

    return NextResponse.json({
      message: 'All data cleared successfully!',
      deleted: {
        locations: locationsResult.deletedCount,
        galleries: galleriesResult.deletedCount,
        articles: articlesResult.deletedCount
      }
    });

  } catch (error) {
    console.error('Error clearing data:', error);
    return NextResponse.json(
      { error: 'Failed to clear data' },
      { status: 500 }
    );
  }
}

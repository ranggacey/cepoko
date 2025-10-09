import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import HomepageSlider from '@/models/HomepageSlider';

// GET - Fetch all homepage slider images
export async function GET() {
  try {
    await connectDB();
    
    const sliders = await HomepageSlider.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    console.log('Found sliders:', sliders.length);
    return NextResponse.json(sliders);
  } catch (error) {
    console.error('Error fetching homepage sliders:', error);
    console.error('Error details:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch homepage sliders',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST - Create new homepage slider image
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const body = await request.json();
    
    // Get the highest order number
    const lastSlider = await HomepageSlider.findOne().sort({ order: -1 });
    const nextOrder = lastSlider ? lastSlider.order + 1 : 1;
    
    const slider = new HomepageSlider({
      title: `Foto Desa Cepoko ${nextOrder}`,
      description: `Gambar slider homepage ke-${nextOrder}`,
      imageUrl: body.imageUrl,
      isActive: body.isActive || true,
      order: nextOrder,
      uploadedBy: session.user.id,
    });
    
    await slider.save();

    return NextResponse.json(slider, { status: 201 });
  } catch (error) {
    console.error('Error creating homepage slider:', error);
    return NextResponse.json(
      { error: 'Failed to create homepage slider' },
      { status: 500 }
    );
  }
}

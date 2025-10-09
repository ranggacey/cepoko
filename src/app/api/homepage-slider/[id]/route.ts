import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import HomepageSlider from '@/models/HomepageSlider';

// GET - Fetch single homepage slider image
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const slider = await HomepageSlider.findById(id).lean();

    if (!slider) {
      return NextResponse.json(
        { error: 'Homepage slider not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(slider);
  } catch (error) {
    console.error('Error fetching homepage slider:', error);
    return NextResponse.json(
      { error: 'Failed to fetch homepage slider' },
      { status: 500 }
    );
  }
}

// PATCH - Update homepage slider image
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;
    
    const slider = await HomepageSlider.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!slider) {
      return NextResponse.json(
        { error: 'Homepage slider not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(slider);
  } catch (error) {
    console.error('Error updating homepage slider:', error);
    return NextResponse.json(
      { error: 'Failed to update homepage slider' },
      { status: 500 }
    );
  }
}

// DELETE - Delete homepage slider image
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const { id } = await params;
    
    const slider = await HomepageSlider.findByIdAndDelete(id);

    if (!slider) {
      return NextResponse.json(
        { error: 'Homepage slider not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Homepage slider deleted successfully' });
  } catch (error) {
    console.error('Error deleting homepage slider:', error);
    return NextResponse.json(
      { error: 'Failed to delete homepage slider' },
      { status: 500 }
    );
  }
}

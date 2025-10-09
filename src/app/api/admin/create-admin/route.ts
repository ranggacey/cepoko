import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@desacepoko.id' });
    
    if (existingAdmin) {
      return NextResponse.json({
        message: 'Admin user already exists',
        success: false
      });
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('cepoko619619', 12);
    const adminUser = new User({
      name: 'Admin Desa Cepoko',
      email: 'admin@desacepoko.id',
      password: hashedPassword,
      role: 'admin'
    });
    
    await adminUser.save();

    return NextResponse.json({
      message: 'Admin user created successfully!',
      success: true,
      credentials: {
        email: 'admin@desacepoko.id',
        password: 'cepoko619619'
      }
    });

  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json(
      { error: 'Failed to create admin user' },
      { status: 500 }
    );
  }
}

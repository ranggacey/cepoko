import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Location from '@/models/Location';
import Gallery from '@/models/Gallery';
import Article from '@/models/Article';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    await connectDB();

    // Clear existing data
    await Location.deleteMany({});
    await Gallery.deleteMany({});
    await Article.deleteMany({});
    await User.deleteMany({});

    // Create admin user
    const hashedPassword = await bcrypt.hash('cepoko619619', 12);
    const adminUser = new User({
      name: 'Admin Desa Cepoko',
      email: 'admin@desacepoko.id',
      password: hashedPassword,
      role: 'admin'
    });
    await adminUser.save();

    // Sample locations
    const sampleLocations = [
      {
        name: 'RW 01 Desa Cepoko',
        type: 'rw',
        description: 'Rukun Warga 01 Desa Cepoko',
        latitude: -7.0051,
        longitude: 110.4381,
        address: 'Jl. Desa Cepoko, RW 01, Desa Cepoko, Gunungpati, Semarang',
        phone: '024-1234567',
        published: true,
        tags: ['rw', 'pemerintahan']
      },
      {
        name: 'RT 01 RW 01',
        type: 'rt',
        description: 'Rukun Tetangga 01 RW 01',
        latitude: -7.0061,
        longitude: 110.4391,
        address: 'Jl. Desa Cepoko, RT 01 RW 01, Desa Cepoko, Gunungpati, Semarang',
        published: true,
        tags: ['rt', 'pemerintahan']
      },
      {
        name: 'Masjid Al-Ikhlas',
        type: 'fasilitas',
        description: 'Masjid utama Desa Cepoko',
        latitude: -7.0041,
        longitude: 110.4371,
        address: 'Jl. Masjid, Desa Cepoko, Gunungpati, Semarang',
        phone: '024-7654321',
        published: true,
        tags: ['masjid', 'ibadah', 'fasilitas']
      },
      {
        name: 'SDN Cepoko',
        type: 'fasilitas',
        description: 'Sekolah Dasar Negeri Cepoko',
        latitude: -7.0071,
        longitude: 110.4401,
        address: 'Jl. Pendidikan, Desa Cepoko, Gunungpati, Semarang',
        phone: '024-9876543',
        published: true,
        tags: ['sekolah', 'pendidikan', 'fasilitas']
      },
      {
        name: 'Pasar Cepoko',
        type: 'fasilitas',
        description: 'Pasar tradisional Desa Cepoko',
        latitude: -7.0031,
        longitude: 110.4361,
        address: 'Jl. Pasar, Desa Cepoko, Gunungpati, Semarang',
        published: true,
        tags: ['pasar', 'ekonomi', 'fasilitas']
      },
      {
        name: 'Taman Desa Cepoko',
        type: 'wisata',
        description: 'Taman rekreasi keluarga di Desa Cepoko',
        latitude: -7.0081,
        longitude: 110.4411,
        address: 'Jl. Taman, Desa Cepoko, Gunungpati, Semarang',
        published: true,
        tags: ['taman', 'rekreasi', 'wisata']
      }
    ];

    for (const location of sampleLocations) {
      const newLocation = new Location(location);
      await newLocation.save();
    }

    // Sample galleries
    const sampleGalleries = [
      {
        title: 'Pemandangan Desa Cepoko',
        description: 'Pemandangan indah Desa Cepoko dari atas bukit',
        category: 'alam',
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        uploadedBy: adminUser._id,
        published: true,
        tags: ['pemandangan', 'alam', 'desa']
      },
      {
        title: 'Kegiatan Gotong Royong',
        description: 'Warga Desa Cepoko melakukan gotong royong membersihkan lingkungan',
        category: 'kegiatan',
        imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&h=600&fit=crop',
        uploadedBy: adminUser._id,
        published: true,
        tags: ['gotong royong', 'kegiatan', 'lingkungan']
      },
      {
        title: 'Masjid Al-Ikhlas',
        description: 'Masjid utama Desa Cepoko yang megah',
        category: 'infrastruktur',
        imageUrl: 'https://images.unsplash.com/photo-1564769668428-4d1e4c2f8e8e?w=800&h=600&fit=crop',
        uploadedBy: adminUser._id,
        published: true,
        tags: ['masjid', 'ibadah', 'infrastruktur']
      },
      {
        title: 'Sawah di Desa Cepoko',
        description: 'Hamparan sawah yang menghijau di Desa Cepoko',
        category: 'alam',
        imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
        uploadedBy: adminUser._id,
        published: true,
        tags: ['sawah', 'pertanian', 'alam']
      },
      {
        title: 'Kegiatan PKK',
        description: 'Kegiatan PKK Desa Cepoko dalam program pemberdayaan perempuan',
        category: 'kegiatan',
        imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop',
        uploadedBy: adminUser._id,
        published: true,
        tags: ['pkk', 'perempuan', 'pemberdayaan']
      },
      {
        title: 'Jalan Desa',
        description: 'Jalan utama Desa Cepoko yang sudah diperbaiki',
        category: 'infrastruktur',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
        uploadedBy: adminUser._id,
        published: true,
        tags: ['jalan', 'infrastruktur', 'pembangunan']
      }
    ];

    for (const gallery of sampleGalleries) {
      const newGallery = new Gallery(gallery);
      await newGallery.save();
    }

    // Sample articles
    const sampleArticles = [
      {
        title: 'Selamat Datang di Desa Cepoko',
        slug: 'selamat-datang-di-desa-cepoko',
        content: `
          <p>Selamat datang di website resmi Desa Cepoko, Gunungpati, Semarang. Desa kami adalah desa yang indah dengan masyarakat yang ramah dan gotong royong.</p>
          
          <p>Desa Cepoko memiliki berbagai fasilitas umum seperti masjid, sekolah, pasar, dan taman yang dapat digunakan oleh seluruh warga desa.</p>
          
          <p>Kami berkomitmen untuk terus mengembangkan desa ini menjadi lebih baik lagi untuk kesejahteraan seluruh warga.</p>
        `,
        excerpt: 'Pengenalan Desa Cepoko yang indah dengan masyarakat yang ramah dan gotong royong.',
        author: adminUser._id,
        published: true,
        tags: ['pengenalan', 'desa', 'selamat datang'],
        views: 150
      },
      {
        title: 'Kegiatan Gotong Royong Rutin',
        slug: 'kegiatan-gotong-royong-rutin',
        content: `
          <p>Desa Cepoko mengadakan kegiatan gotong royong rutin setiap minggu untuk menjaga kebersihan dan keindahan lingkungan desa.</p>
          
          <p>Kegiatan ini melibatkan seluruh warga desa dari berbagai usia, mulai dari anak-anak hingga lansia. Bersama-sama membersihkan jalan, saluran air, dan taman desa.</p>
          
          <p>Melalui gotong royong ini, kami berharap dapat menciptakan lingkungan yang bersih, sehat, dan nyaman untuk semua warga.</p>
        `,
        excerpt: 'Kegiatan gotong royong rutin untuk menjaga kebersihan dan keindahan lingkungan desa.',
        author: adminUser._id,
        published: true,
        tags: ['gotong royong', 'kegiatan', 'lingkungan'],
        views: 89
      },
      {
        title: 'Pembangunan Infrastruktur Desa',
        slug: 'pembangunan-infrastruktur-desa',
        content: `
          <p>Pemerintah desa terus berupaya membangun dan memperbaiki infrastruktur di Desa Cepoko untuk meningkatkan kesejahteraan warga.</p>
          
          <p>Beberapa pembangunan yang telah dilakukan antara lain perbaikan jalan desa, pembangunan drainase, dan renovasi fasilitas umum.</p>
          
          <p>Kedepannya, akan ada pembangunan taman bermain anak, perpustakaan desa, dan fasilitas olahraga untuk mendukung aktivitas warga.</p>
        `,
        excerpt: 'Upaya pemerintah desa dalam membangun dan memperbaiki infrastruktur untuk kesejahteraan warga.',
        author: adminUser._id,
        published: true,
        tags: ['pembangunan', 'infrastruktur', 'pemerintah'],
        views: 67
      }
    ];

    for (const article of sampleArticles) {
      const newArticle = new Article(article);
      await newArticle.save();
    }

    return NextResponse.json({
      message: 'Sample data created successfully!',
      data: {
        users: 1,
        locations: sampleLocations.length,
        galleries: sampleGalleries.length,
        articles: sampleArticles.length
      }
    });

  } catch (error) {
    console.error('Error seeding data:', error);
    return NextResponse.json(
      { error: 'Failed to seed data' },
      { status: 500 }
    );
  }
}

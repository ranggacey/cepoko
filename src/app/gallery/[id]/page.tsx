import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, Tag, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import connectDB from '@/lib/mongodb';
import Gallery from '@/models/Gallery';

interface GalleryPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getGallery(id: string): Promise<any | null> {
  try {
    await connectDB();
    
    // Query by ID - Simple and fast!
    const gallery: any = await Gallery.findById(id)
      .populate('uploadedBy', 'name email')
      .lean();
    
    // Only return if published
    if (!gallery || !gallery.published) {
      return null;
    }
    
    return gallery;
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return null;
  }
}

async function getRelatedGalleries(currentId: string, category: string, limit: number = 4): Promise<any[]> {
  try {
    await connectDB();
    
    const galleries = await Gallery.find({ 
      _id: { $ne: currentId },
      category,
      published: true
    })
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
      
    return galleries;
  } catch (error) {
    console.error('Error fetching related galleries:', error);
    return [];
  }
}

// Force dynamic rendering - Always works!
export const dynamic = 'force-dynamic';

// Optional: Cache for 1 hour (ISR)
// export const revalidate = 3600;

export async function generateMetadata({ params }: GalleryPageProps) {
  const { id } = await params;
  const gallery = await getGallery(id);

  if (!gallery) {
    return {
      title: 'Galeri Tidak Ditemukan',
    };
  }

  return {
    title: `${gallery.title} - Galeri Desa Cepoko`,
    description: gallery.description || `Foto ${gallery.title} dari Desa Cepoko`,
    openGraph: {
      title: gallery.title,
      description: gallery.description || `Foto ${gallery.title} dari Desa Cepoko`,
      images: gallery.images?.length > 0 ? [gallery.images[0]] : [],
    },
  };
}

export default async function GalleryDetailPage({ params }: GalleryPageProps) {
  const { id } = await params;
  const gallery = await getGallery(id);

  if (!gallery) {
    notFound();
  }

  const relatedGalleries = await getRelatedGalleries(id, gallery.category);

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const categoryLabels: { [key: string]: string } = {
    kegiatan: 'Kegiatan Desa',
    pemandangan: 'Pemandangan',
    infrastruktur: 'Infrastruktur',
    budaya: 'Budaya',
    umkm: 'UMKM',
    lainnya: 'Lainnya'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link 
          href="/gallery"
          className="inline-flex items-center text-green-600 hover:text-green-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Galeri
        </Link>

        {/* Gallery Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <Tag className="w-4 h-4 mr-1" />
                {categoryLabels[gallery.category] || gallery.category}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {gallery.title}
            </h1>

            {gallery.description && (
              <p className="text-lg text-gray-600 mb-6">
                {gallery.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {formatDate(gallery.createdAt)}
              </div>
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                {(gallery.uploadedBy as any)?.name || 'Admin'}
              </div>
              <div className="flex items-center">
                📸 {gallery.images?.length || 0} Foto
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {gallery.images && gallery.images.length > 0 ? (
            gallery.images.map((image: string, index: number) => (
              <div 
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow group"
              >
                <Image
                  src={image}
                  alt={`${gallery.title} - Foto ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">Tidak ada foto yang tersedia</p>
            </div>
          )}
        </div>

        {/* Related Galleries */}
        {relatedGalleries.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Galeri Terkait</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedGalleries.map((relatedGallery) => (
                <Link
                  key={relatedGallery._id.toString()}
                  href={`/gallery/${relatedGallery._id}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative aspect-square">
                      {relatedGallery.images && relatedGallery.images.length > 0 ? (
                        <Image
                          src={relatedGallery.images[0]}
                          alt={relatedGallery.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-4xl">📷</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded mb-2">
                        {categoryLabels[relatedGallery.category] || relatedGallery.category}
                      </span>
                      <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 mb-2">
                        {relatedGallery.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        📸 {relatedGallery.images?.length || 0} Foto
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}


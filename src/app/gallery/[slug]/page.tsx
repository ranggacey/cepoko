import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, User, Tag, ArrowLeft } from 'lucide-react';
import connectDB from '@/lib/mongodb';
import Gallery from '@/models/Gallery';

interface GalleryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getGallery(slug: string): Promise<any | null> {
  try {
    await connectDB();
    
    // Try to find by slug first
    let gallery = await Gallery.findOne({ slug, published: true })
      .populate('uploadedBy', 'name email')
      .lean();
    
    // If not found by slug, try by ID (fallback for old galleries)
    if (!gallery) {
      gallery = await Gallery.findById(slug)
        .populate('uploadedBy', 'name email')
        .lean();
    }
    
    return gallery;
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return null;
  }
}

async function getRelatedGalleries(currentSlug: string, category: string, limit: number = 4): Promise<any[]> {
  try {
    await connectDB();
    const galleries = await Gallery.find({
      slug: { $ne: currentSlug },
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

export async function generateMetadata({ params }: GalleryPageProps) {
  const { slug } = await params;
  const gallery = await getGallery(slug);

  if (!gallery) {
    return {
      title: 'Gallery Not Found',
    };
  }

  return {
    title: `${gallery.title} - Galeri Desa Cepoko`,
    description: gallery.description || `Foto ${gallery.title} dari Desa Cepoko`,
    openGraph: {
      title: gallery.title,
      description: gallery.description || `Foto ${gallery.title} dari Desa Cepoko`,
      images: [
        {
          url: gallery.imageUrl,
          width: 1200,
          height: 630,
          alt: gallery.title,
        },
      ],
    },
  };
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const { slug } = await params;
  const gallery = await getGallery(slug);

  if (!gallery) {
    notFound();
  }

  const relatedGalleries = await getRelatedGalleries(slug, gallery.category);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      desa: 'Desa',
      kegiatan: 'Kegiatan',
      infrastruktur: 'Infrastruktur',
      alam: 'Alam',
      lainnya: 'Lainnya'
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      desa: 'bg-blue-100 text-blue-800',
      kegiatan: 'bg-green-100 text-green-800',
      infrastruktur: 'bg-yellow-100 text-yellow-800',
      alam: 'bg-emerald-100 text-emerald-800',
      lainnya: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="font-bold text-xl text-gray-900">Desa Cepoko</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-black hover:text-green-600 transition-colors">Beranda</Link>
              <Link href="/gallery" className="text-green-600 font-medium">Galeri</Link>
              <Link href="/maps" className="text-black hover:text-green-600 transition-colors">Peta Lokasi</Link>
              <Link href="/articles" className="text-black hover:text-green-600 transition-colors">Artikel</Link>
              <Link href="/contact" className="text-black hover:text-green-600 transition-colors">Kontak</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-green-600">Beranda</Link>
            <span className="text-gray-400">/</span>
            <Link href="/gallery" className="text-gray-500 hover:text-green-600">Galeri</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">{gallery.title}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            href="/gallery" 
            className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Galeri
          </Link>
        </div>

        {/* Gallery Content */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Image */}
          <div className="relative">
            <img
              src={gallery.imageUrl}
              alt={gallery.title}
              className="w-full h-96 object-cover"
            />
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(gallery.category)}`}>
                {getCategoryLabel(gallery.category)}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{gallery.title}</h1>
            
            {gallery.description && (
              <div className="prose prose-gray max-w-none mb-6">
                <p className="text-gray-600 leading-relaxed">{gallery.description}</p>
              </div>
            )}

            {/* Tags */}
            {gallery.tags && gallery.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {gallery.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-t pt-6">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span>Oleh: {gallery.uploadedBy?.name || 'Admin'}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{formatDate(gallery.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Galleries */}
        {relatedGalleries.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Galeri Terkait</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedGalleries.map((relatedGallery: any) => (
                <Link
                  key={relatedGallery._id.toString()}
                  href={`/gallery/${relatedGallery.slug}`}
                  className="group bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={relatedGallery.thumbnailUrl || relatedGallery.imageUrl}
                      alt={relatedGallery.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(relatedGallery.category)}`}>
                        {getCategoryLabel(relatedGallery.category)}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2">
                      {relatedGallery.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(relatedGallery.createdAt)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

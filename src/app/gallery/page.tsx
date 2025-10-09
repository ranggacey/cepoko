'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Camera, Search, Filter, ExternalLink } from 'lucide-react';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';
export default function GalleryPage() {
  const [galleries, setGalleries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { value: 'all', label: 'Semua' },
    { value: 'desa', label: 'Desa' },
    { value: 'kegiatan', label: 'Kegiatan' },
    { value: 'infrastruktur', label: 'Infrastruktur' },
    { value: 'alam', label: 'Alam' },
    { value: 'lainnya', label: 'Lainnya' },
  ];

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      setError(null);
      const response = await fetch('/api/galleries');
      if (response.ok) {
        const data = await response.json();
        setGalleries(Array.isArray(data) ? data : []);
      } else {
        setError('Gagal memuat galeri');
      }
    } catch (error) {
      console.error('Error fetching galleries:', error);
      setError('Terjadi kesalahan saat memuat galeri');
    } finally {
      setLoading(false);
    }
  };

  const filteredGalleries = galleries.filter(gallery => {
    if (!gallery || typeof gallery !== 'object') return false;
    
    const matchesCategory = selectedCategory === 'all' || gallery.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      (gallery.title && gallery.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (gallery.description && gallery.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch && gallery.published;
  });

  const getCategoryLabel = (category: string) => {
    const categoryLabels = {
      desa: 'Desa',
      kegiatan: 'Kegiatan',
      infrastruktur: 'Infrastruktur',
      alam: 'Alam',
      lainnya: 'Lainnya',
    };
    return categoryLabels[category as keyof typeof categoryLabels] || 'Lainnya';
  };

  const getCategoryColor = (category: string) => {
    const categoryColors = {
      desa: 'bg-blue-100 text-blue-800',
      kegiatan: 'bg-green-100 text-green-800',
      infrastruktur: 'bg-yellow-100 text-yellow-800',
      alam: 'bg-emerald-100 text-emerald-800',
      lainnya: 'bg-gray-100 text-gray-800',
    };
    return categoryColors[category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-black">Memuat galeri...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-black mb-2">Terjadi Kesalahan</h2>
            <p className="text-black mb-4">{error}</p>
            <button 
              onClick={fetchGalleries}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Coba Lagi
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
      
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-black">Galeri Foto Desa Cepoko</h1>
            <p className="text-black mt-2">
              Koleksi foto-foto indah dan kegiatan di Desa Cepoko
            </p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Cari foto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.value
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-black">
            Menampilkan {filteredGalleries.length} dari {galleries.length} foto
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {filteredGalleries.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-black mb-2">Belum ada foto</h3>
            <p className="text-black">
              Galeri foto akan segera diisi dengan foto-foto menarik dari Desa Cepoko.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGalleries.map((gallery, index) => (
              <div
                key={gallery._id?.toString() || index}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
              >
                {/* Image */}
                <div className="aspect-square relative overflow-hidden">
                  <Link href={`/gallery/${gallery.slug || gallery._id?.toString() || index}`}>
                    <div className="cursor-pointer">
                      {gallery.imageUrl ? (
                        <Image
                          src={gallery.imageUrl}
                          alt={gallery.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-4xl">📸</span>
                        </div>
                      )}
                    </div>
                  </Link>
                  
                  {/* Category Badge */}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(gallery.category)}`}>
                      {getCategoryLabel(gallery.category)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {gallery.title}
                  </h3>
                  {gallery.description && (
                    <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                      {gallery.description}
                    </p>
                  )}
                  
                  {/* Tags */}
                  {gallery.tags && gallery.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {gallery.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                      {gallery.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{gallery.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Date */}
                  <p className="text-xs text-gray-500 mb-3">
                    {new Date(gallery.createdAt).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  
                  {/* View More Button */}
                  <Link 
                    href={`/gallery/${gallery.slug || gallery._id?.toString() || index}`}
                    className="inline-flex items-center text-sm text-green-600 hover:text-green-700 transition-colors"
                  >
                    <span>Lihat Selengkapnya</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

        <Footer />
      </div>
    </ErrorBoundary>
  );
}

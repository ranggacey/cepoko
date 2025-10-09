'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { IGallery } from '@/models/Gallery';

export default function AdminGalleriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [galleries, setGalleries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { value: 'all', label: 'Semua Kategori' },
    { value: 'desa', label: 'Desa' },
    { value: 'kegiatan', label: 'Kegiatan' },
    { value: 'infrastruktur', label: 'Infrastruktur' },
    { value: 'alam', label: 'Alam' },
    { value: 'lainnya', label: 'Lainnya' },
  ];

  useEffect(() => {
    if (status === 'unauthenticated' || session?.user?.role !== 'admin') {
      router.push('/cepoko');
      return;
    }
    fetchGalleries();
  }, [session, status, router]);

  const fetchGalleries = async () => {
    try {
      const response = await fetch('/api/galleries');
      if (response.ok) {
        const data = await response.json();
        setGalleries(data);
      }
    } catch (error) {
      console.error('Error fetching galleries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus foto ini?')) return;

    try {
      const response = await fetch(`/api/galleries/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setGalleries(galleries.filter(gallery => gallery._id.toString() !== id));
        alert('Foto berhasil dihapus!');
      } else {
        alert('Gagal menghapus foto');
      }
    } catch (error) {
      console.error('Error deleting gallery:', error);
      alert('Terjadi kesalahan saat menghapus foto');
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/galleries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published: !currentStatus }),
      });

      if (response.ok) {
        setGalleries(galleries.map(gallery => 
          gallery._id.toString() === id 
            ? { ...gallery, published: !currentStatus }
            : gallery
        ));
      }
    } catch (error) {
      console.error('Error updating gallery:', error);
    }
  };

  const filteredGalleries = galleries.filter(gallery => {
    const matchesCategory = selectedCategory === 'all' || gallery.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      gallery.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gallery.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
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

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat galeri...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="font-bold text-xl text-gray-900">Kelola Galeri</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/galleries/new"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                + Upload Foto Baru
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Cari foto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-2">
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
          
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>Menampilkan {filteredGalleries.length} dari {galleries.length} foto</span>
            <span>Published: {galleries.filter(g => g.published).length} | Draft: {galleries.filter(g => !g.published).length}</span>
          </div>
        </div>

        {/* Galleries Grid */}
        {filteredGalleries.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || selectedCategory !== 'all' ? 'Foto tidak ditemukan' : 'Belum ada foto'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCategory !== 'all' ? 'Coba kata kunci atau kategori lain' : 'Mulai upload foto pertama Anda'}
            </p>
            {!searchTerm && selectedCategory === 'all' && (
              <Link
                href="/admin/galleries/new"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                + Upload Foto Pertama
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGalleries.map((gallery) => (
              <div
                key={gallery._id.toString()}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <div className="aspect-square relative overflow-hidden">
                  {gallery.imageUrl ? (
                    <Image
                      src={gallery.imageUrl}
                      alt={gallery.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-4xl">📸</span>
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-2 left-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        gallery.published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {gallery.published ? 'Published' : 'Draft'}
                    </span>
                  </div>

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
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {gallery.description}
                    </p>
                  )}
                  
                  {/* Tags */}
                  {gallery.tags && gallery.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {gallery.tags.slice(0, 2).map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                      {gallery.tags.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{gallery.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Date */}
                  <p className="text-xs text-gray-500 mb-4">
                    {new Date(gallery.createdAt).toLocaleDateString('id-ID')}
                  </p>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => togglePublish(gallery._id.toString(), gallery.published)}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        gallery.published
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {gallery.published ? 'Unpublish' : 'Publish'}
                    </button>
                    
                    <Link
                      href={`/admin/galleries/${gallery._id.toString()}/edit`}
                      className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded text-xs font-medium transition-colors"
                    >
                      Edit
                    </Link>
                    
                    <Link
                      href="/gallery"
                      target="_blank"
                      className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded text-xs font-medium transition-colors"
                    >
                      View
                    </Link>
                    
                    <button
                      onClick={() => handleDeleteGallery(gallery._id.toString())}
                      className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded text-xs font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

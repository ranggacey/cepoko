'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Newspaper, Camera, MapPin, Eye } from 'lucide-react';

interface DashboardStats {
  articles: number;
  galleries: number;
  locations: number;
  totalViews: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    articles: 0,
    galleries: 0,
    locations: 0,
    totalViews: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/cepoko');
      return;
    }

    if (session?.user?.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchStats();
  }, [session, status, router]);

  const fetchStats = async () => {
    try {
      const [articlesRes, galleriesRes, locationsRes] = await Promise.all([
        fetch('/api/articles'),
        fetch('/api/galleries'),
        fetch('/api/locations')
      ]);

      const [articles, galleries, locations] = await Promise.all([
        articlesRes.json(),
        galleriesRes.json(),
        locationsRes.json()
      ]);

      const totalViews = articles.reduce((sum: number, article: any) => sum + (article.views || 0), 0);

      setStats({
        articles: articles.length,
        galleries: galleries.length,
        locations: locations.length,
        totalViews
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-black">Memuat dashboard...</p>
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
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="font-bold text-xl text-gray-900">Admin Dashboard</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Selamat datang, <span className="font-medium">{session.user.name}</span>
              </span>
              <button
                onClick={() => signOut()}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-gray-600 mt-2">
            Kelola konten website Desa Cepoko
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Newspaper className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Artikel</p>
                <p className="text-2xl font-bold text-gray-900">{stats.articles}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Camera className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Galeri</p>
                <p className="text-2xl font-bold text-gray-900">{stats.galleries}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <MapPin className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Lokasi</p>
                <p className="text-2xl font-bold text-gray-900">{stats.locations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Articles Management */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Kelola Artikel</h3>
                <Link
                  href="/admin/articles/new"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  + Artikel Baru
                </Link>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Buat dan kelola artikel berita tentang Desa Cepoko
              </p>
              <div className="flex space-x-3">
                <Link
                  href="/admin/articles"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Lihat Semua
                </Link>
                <Link
                  href="/articles"
                  target="_blank"
                  className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Preview
                </Link>
              </div>
            </div>
          </div>

          {/* Galleries Management */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Kelola Galeri</h3>
                <Link
                  href="/admin/galleries/new"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  + Foto Baru
                </Link>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Upload dan kelola foto-foto Desa Cepoko
              </p>
              <div className="flex space-x-3">
                <Link
                  href="/admin/galleries"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Lihat Semua
                </Link>
                <Link
                  href="/gallery"
                  target="_blank"
                  className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Preview
                </Link>
              </div>
            </div>
          </div>

          {/* Homepage Slider Management */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Kelola Slider Homepage</h3>
                <Link
                  href="/admin/homepage-slider"
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Kelola Slider
                </Link>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Upload dan kelola gambar-gambar untuk slider homepage
              </p>
              <div className="flex space-x-3">
                <Link
                  href="/admin/homepage-slider"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Kelola Slider
                </Link>
                <Link
                  href="/"
                  target="_blank"
                  className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Preview Homepage
                </Link>
              </div>
            </div>
          </div>

          {/* Locations Management */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Kelola Lokasi</h3>
                <Link
                  href="/admin/locations/new"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  + Lokasi Baru
                </Link>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Tambah dan kelola lokasi RW, RT, fasilitas di peta
              </p>
              <div className="flex space-x-3">
                <Link
                  href="/admin/locations"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Lihat Semua
                </Link>
                <Link
                  href="/maps"
                  target="_blank"
                  className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Preview
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

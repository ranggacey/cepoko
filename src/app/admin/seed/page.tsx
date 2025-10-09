'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SeedDataPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated' || session?.user?.role !== 'admin') {
    router.push('/cepoko');
    return null;
  }

  const handleSeedData = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Terjadi kesalahan saat generate data');
      }
    } catch (error) {
      setError('Terjadi kesalahan saat generate data');
    } finally {
      setLoading(false);
    }
  };

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
                <span className="font-bold text-xl text-gray-900">Admin Dashboard</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Selamat datang, <span className="font-medium">{session?.user?.name}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Generate Sample Data</h1>
            <p className="text-gray-600">
              Generate data contoh untuk testing website Desa Cepoko
            </p>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="text-yellow-600 text-xl">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Peringatan
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Aksi ini akan menghapus semua data yang ada dan menggantinya dengan data contoh. 
                    Pastikan Anda sudah backup data penting jika ada.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Data yang akan di-generate */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Data yang akan di-generate:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">👤</span>
                  <div>
                    <h3 className="font-medium text-blue-900">Admin User</h3>
                    <p className="text-sm text-blue-700">admin@desacepoko.id / admin123</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <h3 className="font-medium text-green-900">6 Lokasi</h3>
                    <p className="text-sm text-green-700">RW, RT, Masjid, Sekolah, Pasar, Taman</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📸</span>
                  <div>
                    <h3 className="font-medium text-purple-900">6 Foto Galeri</h3>
                    <p className="text-sm text-purple-700">Foto-foto desa dari Unsplash</p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📰</span>
                  <div>
                    <h3 className="font-medium text-orange-900">3 Artikel</h3>
                    <p className="text-sm text-orange-700">Artikel tentang Desa Cepoko</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="text-center mb-8">
            <button
              onClick={handleSeedData}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating Data...
                </div>
              ) : (
                'Generate Sample Data'
              )}
            </button>
          </div>

          {/* Result */}
          {result && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <span className="text-green-600 text-xl">✅</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-green-800 mb-2">
                    Data berhasil di-generate!
                  </h3>
                  <div className="text-sm text-green-700 space-y-1">
                    <p>• Users: {result.data.users}</p>
                    <p>• Locations: {result.data.locations}</p>
                    <p>• Galleries: {result.data.galleries}</p>
                    <p>• Articles: {result.data.articles}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <span className="text-red-600 text-xl">❌</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-red-800 mb-2">
                    Terjadi Kesalahan
                  </h3>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-center space-x-4">
            <Link
              href="/admin"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              ← Kembali ke Dashboard
            </Link>
            
            <Link
              href="/"
              target="_blank"
              className="bg-green-100 hover:bg-green-200 text-green-700 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Lihat Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

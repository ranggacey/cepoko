'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ILocation } from '@/models/Location';

export default function AdminLocationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const locationTypes = [
    { value: 'all', label: 'Semua Tipe' },
    { value: 'rw', label: 'RW' },
    { value: 'rt', label: 'RT' },
    { value: 'kelurahan', label: 'Kelurahan' },
    { value: 'fasilitas', label: 'Fasilitas' },
    { value: 'wisata', label: 'Wisata' },
    { value: 'lainnya', label: 'Lainnya' },
  ];

  useEffect(() => {
    if (status === 'unauthenticated' || session?.user?.role !== 'admin') {
      router.push('/cepoko');
      return;
    }
    fetchLocations();
  }, [session, status, router]);

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/locations');
      if (response.ok) {
        const data = await response.json();
        setLocations(data);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLocation = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus lokasi ini?')) return;

    try {
      const response = await fetch(`/api/locations/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setLocations(locations.filter(location => location._id.toString() !== id));
        alert('Lokasi berhasil dihapus!');
      } else {
        alert('Gagal menghapus lokasi');
      }
    } catch (error) {
      console.error('Error deleting location:', error);
      alert('Terjadi kesalahan saat menghapus lokasi');
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/locations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published: !currentStatus }),
      });

      if (response.ok) {
        setLocations(locations.map(location => 
          location._id.toString() === id 
            ? { ...location, published: !currentStatus }
            : location
        ));
      }
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  const filteredLocations = locations.filter(location => {
    const matchesType = selectedType === 'all' || location.type === selectedType;
    const matchesSearch = searchTerm === '' || 
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesSearch;
  });

  const getTypeLabel = (type: string) => {
    const typeLabels = {
      rw: 'RW',
      rt: 'RT',
      kelurahan: 'Kelurahan',
      fasilitas: 'Fasilitas',
      wisata: 'Wisata',
      lainnya: 'Lainnya',
    };
    return typeLabels[type as keyof typeof typeLabels] || 'Lainnya';
  };

  const getTypeColor = (type: string) => {
    const typeColors = {
      rw: 'bg-blue-100 text-blue-800',
      rt: 'bg-green-100 text-green-800',
      kelurahan: 'bg-yellow-100 text-yellow-800',
      fasilitas: 'bg-red-100 text-red-800',
      wisata: 'bg-purple-100 text-purple-800',
      lainnya: 'bg-gray-100 text-gray-800',
    };
    return typeColors[type as keyof typeof typeColors] || 'bg-gray-100 text-gray-800';
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat lokasi...</p>
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
                <span className="font-bold text-xl text-gray-900">Kelola Lokasi</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/locations/new"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                + Lokasi Baru
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
                placeholder="Cari lokasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {locationTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedType === type.value
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>Menampilkan {filteredLocations.length} dari {locations.length} lokasi</span>
            <span>Published: {locations.filter(l => l.published).length} | Draft: {locations.filter(l => !l.published).length}</span>
          </div>
        </div>

        {/* Locations Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredLocations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || selectedType !== 'all' ? 'Lokasi tidak ditemukan' : 'Belum ada lokasi'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedType !== 'all' ? 'Coba kata kunci atau filter lain' : 'Mulai tambah lokasi pertama Anda'}
              </p>
              {!searchTerm && selectedType === 'all' && (
                <Link
                  href="/admin/locations/new"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  + Tambah Lokasi Pertama
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lokasi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipe
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Koordinat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLocations.map((location) => (
                    <tr key={location._id.toString()} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            {location.imageUrl ? (
                              <img
                                className="h-12 w-12 rounded-lg object-cover"
                                src={location.imageUrl}
                                alt={location.name}
                              />
                            ) : (
                              <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-gray-500">📍</span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {location.name}
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {location.address}
                            </div>
                            {location.description && (
                              <div className="text-xs text-gray-400 line-clamp-1">
                                {location.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(location.type)}`}>
                          {getTypeLabel(location.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="font-mono text-xs">
                          {location.latitude.toFixed(6)}
                        </div>
                        <div className="font-mono text-xs">
                          {location.longitude.toFixed(6)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            location.published
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {location.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => togglePublish(location._id.toString(), location.published)}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                              location.published
                                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {location.published ? 'Unpublish' : 'Publish'}
                          </button>
                          
                          <Link
                            href={`/admin/locations/${location._id.toString()}/edit`}
                            className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded text-xs font-medium transition-colors"
                          >
                            Edit
                          </Link>
                          
                          <Link
                            href={`/maps?lat=${location.latitude}&lng=${location.longitude}`}
                            target="_blank"
                            className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded text-xs font-medium transition-colors"
                          >
                            View
                          </Link>
                          
                          <button
                            onClick={() => handleDeleteLocation(location._id.toString())}
                            className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded text-xs font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

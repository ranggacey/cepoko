'use client';

import { useState, useEffect } from 'react';
import { MapPin, List, Map } from 'lucide-react';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import ClientMapComponent from '@/components/Maps/ClientMapComponent';
import LocationFilter from '@/components/Maps/LocationFilter';
import LocationList from '@/components/Maps/LocationList';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ILocation } from '@/models/Location';

export default function MapsPage() {
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<ILocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<ILocation | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/locations');
      if (response.ok) {
        const data = await response.json();
        setLocations(data);
        setFilteredLocations(data);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filtered: ILocation[]) => {
    setFilteredLocations(filtered);
  };

  const handleLocationSelect = (location: ILocation) => {
    setSelectedLocation(location);
    setViewMode('map');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-black">Memuat peta lokasi...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black">Peta Lokasi Desa Cepoko</h1>
              <p className="text-black mt-2">
                Temukan lokasi RW, RT, fasilitas, dan tempat penting di Desa Cepoko
              </p>
            </div>
            
            {/* View Toggle */}
            <div className="mt-4 md:mt-0">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'map'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  🗺️ Peta
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  📋 Daftar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter */}
        <LocationFilter
          locations={locations}
          onFilterChange={handleFilterChange}
        />

        {/* Map or List View */}
        {viewMode === 'map' ? (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <ErrorBoundary>
              <ClientMapComponent
                locations={filteredLocations}
                center={[-7.0051, 110.4381]} // Koordinat Gunungpati
                zoom={13}
                height="600px"
              />
            </ErrorBoundary>
            
            {/* Map Legend */}
            <div className="p-4 bg-gray-50 border-t">
              <h3 className="font-semibold text-black mb-3">Legenda:</h3>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span>RW</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span>RT</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span>Kelurahan</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span>Fasilitas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                  <span>Wisata</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <LocationList
              locations={filteredLocations}
              onLocationSelect={handleLocationSelect}
            />
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Tips Penggunaan</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Klik marker di peta untuk melihat informasi detail lokasi</li>
            <li>• Gunakan tombol "Navigasi" untuk membuka Google Maps</li>
            <li>• Gunakan filter untuk mencari lokasi berdasarkan jenis atau nama</li>
            <li>• Switch ke mode "Daftar" untuk melihat semua lokasi dalam bentuk list</li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
}

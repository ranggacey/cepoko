'use client';

import { useState, useEffect } from 'react';
import { MapPin, List, Map, Lightbulb } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');

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
      <div className="bg-white border-b-2 border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Peta Lokasi Desa Cepoko</h1>
                  <p className="text-gray-600 text-sm md:text-base mt-1">
                    Temukan lokasi RW, RT, fasilitas, dan tempat penting
                  </p>
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-green-50 border border-green-100 rounded-lg p-4 hover:bg-green-100 transition-colors">
                  <div className="text-2xl font-bold text-green-600">{filteredLocations.length}</div>
                  <div className="text-gray-600 text-sm">Total Lokasi</div>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 hover:bg-blue-100 transition-colors">
                  <div className="text-2xl font-bold text-blue-600">
                    {filteredLocations.filter(l => l.type === 'rw').length}
                  </div>
                  <div className="text-gray-600 text-sm">RW</div>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 hover:bg-emerald-100 transition-colors">
                  <div className="text-2xl font-bold text-emerald-600">
                    {filteredLocations.filter(l => l.type === 'rt').length}
                  </div>
                  <div className="text-gray-600 text-sm">RT</div>
                </div>
                <div className="bg-red-50 border border-red-100 rounded-lg p-4 hover:bg-red-100 transition-colors">
                  <div className="text-2xl font-bold text-red-600">
                    {filteredLocations.filter(l => l.type === 'fasilitas').length}
                  </div>
                  <div className="text-gray-600 text-sm">Fasilitas</div>
                </div>
              </div>
            </div>
            
            {/* View Toggle */}
            <div className="mt-6 md:mt-0 md:ml-6">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-4 py-2.5 rounded-md text-sm font-medium transition-all flex items-center ${
                    viewMode === 'map'
                      ? 'bg-white text-green-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Map className="w-4 h-4 mr-2" /> Peta
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2.5 rounded-md text-sm font-medium transition-all flex items-center ${
                    viewMode === 'list'
                      ? 'bg-white text-green-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="w-4 h-4 mr-2" /> Daftar
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
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2" /> Tips Penggunaan
          </h3>
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

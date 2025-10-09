'use client';

import { useState } from 'react';
import { ILocation } from '@/models/Location';

interface LocationFilterProps {
  locations: ILocation[];
  onFilterChange: (filteredLocations: ILocation[]) => void;
}

export default function LocationFilter({ locations, onFilterChange }: LocationFilterProps) {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const locationTypes = [
    { value: 'all', label: 'Semua Lokasi' },
    { value: 'rw', label: 'RW' },
    { value: 'rt', label: 'RT' },
    { value: 'kelurahan', label: 'Kelurahan' },
    { value: 'fasilitas', label: 'Fasilitas' },
    { value: 'wisata', label: 'Wisata' },
    { value: 'lainnya', label: 'Lainnya' },
  ];

  const handleFilterChange = (type: string, search: string) => {
    let filtered = locations;

    // Filter by type
    if (type !== 'all') {
      filtered = filtered.filter(location => location.type === type);
    }

    // Filter by search term
    if (search.trim()) {
      filtered = filtered.filter(location =>
        location.name.toLowerCase().includes(search.toLowerCase()) ||
        location.description?.toLowerCase().includes(search.toLowerCase()) ||
        location.address.toLowerCase().includes(search.toLowerCase())
      );
    }

    onFilterChange(filtered);
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    handleFilterChange(type, searchTerm);
  };

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    handleFilterChange(selectedType, search);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Cari lokasi..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Type Filter */}
        <div className="flex gap-2 flex-wrap">
          {locationTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => handleTypeChange(type.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedType === type.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mt-3 text-sm text-gray-600">
        Menampilkan {locations.filter(location => {
          if (selectedType !== 'all' && location.type !== selectedType) return false;
          if (searchTerm.trim()) {
            return location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   location.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   location.address.toLowerCase().includes(searchTerm.toLowerCase());
          }
          return true;
        }).length} dari {locations.length} lokasi
      </div>
    </div>
  );
}

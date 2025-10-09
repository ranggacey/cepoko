'use client';

import { MapPin, Phone, Mail, Navigation, Copy } from 'lucide-react';
import { ILocation } from '@/models/Location';

interface LocationListProps {
  locations: ILocation[];
  onLocationSelect?: (location: ILocation) => void;
}

export default function LocationList({ locations, onLocationSelect }: LocationListProps) {
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

  const handleNavigateToGoogleMaps = (location: ILocation) => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`;
    window.open(googleMapsUrl, '_blank');
  };

  if (locations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Tidak ada lokasi ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {locations.map((location) => (
        <div
          key={(location as any)._id.toString()}
          className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onLocationSelect?.(location)}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-gray-900">{location.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(location.type)}`}>
              {getTypeLabel(location.type)}
            </span>
          </div>
          
          {location.description && (
            <p className="text-gray-600 text-sm mb-2">{location.description}</p>
          )}
          
          <p className="text-gray-500 text-sm mb-3 flex items-center">
            <MapPin className="w-4 h-4 mr-2" /> {location.address}
          </p>
          
          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
            {location.phone && (
              <span className="flex items-center">
                <Phone className="w-3 h-3 mr-1" /> {location.phone}
              </span>
            )}
            {location.email && (
              <span className="flex items-center">
                <Mail className="w-3 h-3 mr-1" /> {location.email}
              </span>
            )}
          </div>
          
          <div className="flex gap-2 mt-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNavigateToGoogleMaps(location);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
            >
              <Navigation className="w-4 h-4 mr-2" /> Navigasi
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(`${location.latitude}, ${location.longitude}`);
                // Bisa tambahkan toast notification di sini
              }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
            >
              <Copy className="w-4 h-4 mr-2" /> Copy Koordinat
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

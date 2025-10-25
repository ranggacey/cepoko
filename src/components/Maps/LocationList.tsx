'use client';

import Image from 'next/image';
import { MapPin, Phone, Mail, Navigation, Copy, ExternalLink, ImageIcon } from 'lucide-react';
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
      <div className="text-center py-12 text-gray-500">
        <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p className="text-lg font-medium">Tidak ada lokasi ditemukan</p>
        <p className="text-sm mt-2">Coba ubah filter pencarian Anda</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {locations.map((location) => (
        <div
          key={(location as any)._id.toString()}
          className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer flex flex-col"
          onClick={() => onLocationSelect?.(location)}
        >
          {/* Image Section */}
          <div className="relative h-48 bg-gradient-to-br from-green-50 to-gray-50 overflow-hidden flex-shrink-0">
            {location.imageUrl ? (
              <>
                <Image
                  src={location.imageUrl}
                  alt={location.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                <ImageIcon className="w-16 h-16 mb-2" />
                <span className="text-sm font-medium">Belum ada foto</span>
              </div>
            )}
            
            {/* Type Badge */}
            <div className="absolute top-3 right-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm ${getTypeColor(location.type)}`}>
                {getTypeLabel(location.type)}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-5 flex flex-col flex-grow">
            {/* Title */}
            <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-1 group-hover:text-green-600 transition-colors">
              {location.name}
            </h3>
            
            {/* Description */}
            <p className="text-gray-600 text-sm mb-3 line-clamp-2 min-h-[40px]">
              {location.description || 'Tidak ada deskripsi'}
            </p>
            
            {/* Address */}
            <div className="flex items-start text-gray-500 text-sm mb-3">
              <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-green-600" />
              <span className="line-clamp-2">{location.address}</span>
            </div>
            
            {/* Contact Info - Fixed Height */}
            <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100 min-h-[48px]">
              {location.phone && (
                <div className="flex items-center">
                  <Phone className="w-3 h-3 mr-1 text-blue-500" />
                  <span>{location.phone}</span>
                </div>
              )}
              {location.email && (
                <div className="flex items-center">
                  <Mail className="w-3 h-3 mr-1 text-red-500" />
                  <span className="truncate">{location.email}</span>
                </div>
              )}
              {!location.phone && !location.email && (
                <span className="text-gray-400 text-xs">Tidak ada kontak</span>
              )}
            </div>
            
            {/* Action Buttons - Push to bottom */}
            <div className="flex gap-2 mt-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigateToGoogleMaps(location);
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center shadow-sm"
              >
                <Navigation className="w-4 h-4 mr-1.5" />
                Navigasi
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(`${location.latitude}, ${location.longitude}`);
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2.5 rounded-lg transition-colors"
                title="Copy Koordinat"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { ILocation } from '@/models/Location';
import { useEffect, useState } from 'react';

// Fix untuk default markers di Leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapComponentProps {
  locations: ILocation[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}

export default function MapComponent({ 
  locations, 
  center = [-7.0051, 110.4381], // Koordinat Gunungpati
  zoom = 13,
  height = '400px'
}: MapComponentProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-100 rounded-lg"
        style={{ height }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat peta...</p>
        </div>
      </div>
    );
  }
  
  const getMarkerIcon = (type: string) => {
    const iconColors = {
      rw: '#3B82F6', // Blue
      rt: '#10B981', // Green
      kelurahan: '#F59E0B', // Yellow
      fasilitas: '#EF4444', // Red
      wisata: '#8B5CF6', // Purple
      lainnya: '#6B7280', // Gray
    };

    const color = iconColors[type as keyof typeof iconColors] || iconColors.lainnya;

    // Generate SVG icon URL safely
    const svgContent = `<svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path fill="${color}" stroke="#fff" stroke-width="2" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0zm0 17c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5 4.5 2 4.5 4.5-2 4.5-4.5 4.5z"/>
    </svg>`;
    
    const iconUrl = typeof window !== 'undefined' && typeof window.btoa === 'function'
      ? `data:image/svg+xml;base64,${btoa(svgContent)}`
      : `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;

    return new Icon({
      iconUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [0, -41],
    });
  };

  const handleNavigateToGoogleMaps = (location: ILocation) => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`;
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <div className="w-full" style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg shadow-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {locations.map((location) => (
          <Marker
            key={(location as any)._id.toString()}
            position={[location.latitude, location.longitude]}
            icon={getMarkerIcon(location.type)}
          >
            <Popup className="custom-popup">
              <div className="p-0 min-w-[240px] max-w-[260px]">
                {/* Header dengan gambar */}
                <div className="relative">
                  {location.imageUrl ? (
                    <div className="h-20 w-full bg-gray-100 rounded-t-lg overflow-hidden">
                      <img 
                        src={location.imageUrl} 
                        alt={location.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="hidden w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="text-lg font-bold">{location.name.charAt(0)}</div>
                          <div className="text-xs opacity-90">{location.type.toUpperCase()}</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-20 w-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center rounded-t-lg">
                      <div className="text-white text-center">
                        <div className="text-lg font-bold">{location.name.charAt(0)}</div>
                        <div className="text-xs opacity-90">{location.type.toUpperCase()}</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Badge type */}
                  <div className="absolute top-1 right-1">
                    <span className={`px-1 py-0.5 rounded-full text-xs font-medium text-white shadow-sm ${
                      location.type === 'kelurahan' ? 'bg-orange-500' :
                      location.type === 'rw' ? 'bg-blue-500' :
                      location.type === 'rt' ? 'bg-green-500' :
                      location.type === 'fasilitas' ? 'bg-red-500' :
                      location.type === 'wisata' ? 'bg-purple-500' :
                      'bg-gray-500'
                    }`}>
                      {location.type.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-2.5">
                  <h3 className="font-bold text-sm mb-1 text-gray-900">{location.name}</h3>
                  
                  {location.description && (
                    <p className="text-xs text-gray-600 mb-1.5 line-clamp-2 leading-relaxed">{location.description}</p>
                  )}
                  
                  <div className="space-y-1 mb-2">
                    <div className="flex items-start">
                      <div className="w-3 h-3 mt-0.5 mr-1.5 flex-shrink-0">
                        <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{location.address}</p>
                    </div>
                    
                    {location.phone && (
                      <div className="flex items-center">
                        <div className="w-3 h-3 mt-0.5 mr-1.5 flex-shrink-0">
                          <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                        </div>
                        <p className="text-xs text-gray-500">
                          <span className="font-medium">Telp:</span> {location.phone}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleNavigateToGoogleMaps(location)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs font-medium transition-colors flex items-center justify-center"
                    >
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Navigasi
                    </button>
                    
                    {location.website && (
                      <button
                        onClick={() => window.open(location.website, '_blank')}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-medium transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

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
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-lg mb-2">{location.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{location.description}</p>
                <p className="text-xs text-gray-500 mb-3">{location.address}</p>
                
                {location.phone && (
                  <p className="text-xs mb-1">
                    <span className="font-semibold">Telp:</span> {location.phone}
                  </p>
                )}
                
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleNavigateToGoogleMaps(location)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                  >
                    Navigasi
                  </button>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                    {location.type.toUpperCase()}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

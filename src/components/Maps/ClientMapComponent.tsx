'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { ILocation } from '@/models/Location';

interface ClientMapComponentProps {
  locations: ILocation[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}

// Dynamically import MapComponent hanya di client-side
const MapComponent = dynamic(
  () => import('./MapComponent'),
  {
    ssr: false,
    loading: () => (
      <div 
        className="flex items-center justify-center bg-gray-100 rounded-lg"
        style={{ height: '400px' }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-black">Memuat peta...</p>
        </div>
      </div>
    )
  }
);

export default function ClientMapComponent(props: ClientMapComponentProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = () => setHasError(true);
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-100 rounded-lg"
        style={{ height: props.height || '400px' }}
      >
        <div className="text-center">
          <p className="text-black">Error loading map</p>
        </div>
      </div>
    );
  }

  return <MapComponent {...props} />;
}

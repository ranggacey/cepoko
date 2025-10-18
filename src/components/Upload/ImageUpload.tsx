'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X } from 'lucide-react';

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  currentImage?: string;
  label?: string;
  className?: string;
}

export default function ImageUpload({ 
  onImageUpload, 
  currentImage, 
  label = "Upload Gambar",
  className = ""
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview when currentImage changes
  useEffect(() => {
    setPreview(currentImage || null);
  }, [currentImage]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Hanya file gambar yang diperbolehkan!');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB!');
      return;
    }

    setUploading(true);

    try {
      console.log('Starting upload for file:', file.name, 'size:', file.size);
      
      const formData = new FormData();
      formData.append('image', file);

      console.log('Sending request to /api/upload');
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response data:', result);

      if (result.success) {
        console.log('Upload successful, URL:', result.url);
        setPreview(result.url);
        onImageUpload(result.url);
      } else {
        console.error('Upload failed:', result);
        const errorMessage = result.details || result.error || 'Gagal mengupload gambar';
        alert(`Error: ${errorMessage}`);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(`Terjadi kesalahan saat mengupload gambar: ${error.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
      // Reset file input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreview(null);
    onImageUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-black mb-2">
        {label}
      </label>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview ? (
        <div className="space-y-4">
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg border border-gray-300"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleClick}
              disabled={uploading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Ganti Gambar'}
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={handleClick}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors"
        >
          {uploading ? (
            <div className="space-y-2">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-black">Mengupload gambar...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Camera className="w-12 h-12 text-gray-400 mx-auto" />
              <p className="text-black">Klik untuk upload gambar</p>
              <p className="text-sm text-black">PNG, JPG, GIF maksimal 5MB</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

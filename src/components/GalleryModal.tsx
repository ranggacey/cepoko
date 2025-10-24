'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, Calendar, User, Tag, Share2, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryModalProps {
  galleryId: string;
  onClose: () => void;
}

export default function GalleryModal({ galleryId, onClose }: GalleryModalProps) {
  const [gallery, setGallery] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [relatedGalleries, setRelatedGalleries] = useState<any[]>([]);

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    fetchGallery();
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [galleryId]);

  const fetchGallery = async () => {
    try {
      const response = await fetch(`/api/galleries/${galleryId}`);
      if (response.ok) {
        const data = await response.json();
        setGallery(data);
        
        // Fetch related galleries
        fetchRelatedGalleries();
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedGalleries = async () => {
    try {
      const response = await fetch('/api/galleries?limit=4');
      if (response.ok) {
        const data = await response.json();
        setRelatedGalleries(data.filter((g: any) => g._id !== galleryId).slice(0, 4));
      }
    } catch (error) {
      console.error('Error fetching related galleries:', error);
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const categoryLabels: { [key: string]: string } = {
    kegiatan: 'Kegiatan Desa',
    pemandangan: 'Pemandangan',
    infrastruktur: 'Infrastruktur',
    budaya: 'Budaya',
    umkm: 'UMKM',
    lainnya: 'Lainnya'
  };

  const handleShare = () => {
    const url = `${window.location.origin}?gallery=${galleryId}`;
    if (navigator.share) {
      navigator.share({
        title: gallery.title,
        text: gallery.description || '',
        url: url
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const nextImage = () => {
    if (gallery?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % gallery.images.length);
    }
  };

  const prevImage = () => {
    if (gallery?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + gallery.images.length) % gallery.images.length);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'Escape') onClose();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gallery]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
            <p className="text-gray-600 font-medium">Memuat galeri...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!gallery) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md">
          <div className="text-center">
            <div className="text-6xl mb-4">😞</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Galeri Tidak Ditemukan</h3>
            <p className="text-gray-600 mb-6">Maaf, galeri yang Anda cari tidak tersedia.</p>
            <button
              onClick={onClose}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn p-4"
      onClick={handleBackdropClick}
    >
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-gray-600 group-hover:text-gray-900" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {gallery.title}
            </h2>
          </div>
          <button
            onClick={handleShare}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
            aria-label="Share"
          >
            <Share2 className="w-5 h-5 text-gray-600 group-hover:text-green-600" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] custom-scrollbar">
          <div className="p-6 md:p-8">
            {/* Gallery Header */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <Tag className="w-4 h-4 mr-1" />
                  {categoryLabels[gallery.category] || gallery.category}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {gallery.title}
              </h1>

              {gallery.description && (
                <p className="text-lg text-gray-600 mb-6">
                  {gallery.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(gallery.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{gallery.uploadedBy?.name || 'Admin'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  📸 {gallery.images?.length || 0} Foto
                </div>
              </div>
            </div>

            {/* Main Image Viewer */}
            {gallery.images && gallery.images.length > 0 && (
              <div className="mb-8">
                <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg bg-gray-100 group">
                  <Image
                    src={gallery.images[currentImageIndex]}
                    alt={`${gallery.title} - Foto ${currentImageIndex + 1}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  />
                  
                  {/* Navigation Arrows */}
                  {gallery.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-6 h-6 text-gray-900" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-6 h-6 text-gray-900" />
                      </button>
                    </>
                  )}
                  
                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium">
                    {currentImageIndex + 1} / {gallery.images.length}
                  </div>
                </div>

                {/* Thumbnail Grid */}
                {gallery.images.length > 1 && (
                  <div className="mt-4 grid grid-cols-6 md:grid-cols-8 gap-2">
                    {gallery.images.map((image: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative aspect-square rounded-lg overflow-hidden transition-all ${
                          index === currentImageIndex
                            ? 'ring-4 ring-green-500 scale-105'
                            : 'ring-2 ring-transparent hover:ring-gray-300'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="100px"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Related Galleries */}
            {relatedGalleries.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Galeri Terkait</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {relatedGalleries.map((related) => (
                    <button
                      key={related._id}
                      onClick={() => {
                        onClose();
                        setTimeout(() => {
                          const element = document.querySelector(`[data-gallery-id="${related._id}"]`);
                          if (element) {
                            (element as HTMLElement).click();
                          }
                        }, 300);
                      }}
                      className="group text-left"
                    >
                      <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-all">
                        <div className="relative aspect-square">
                          {related.images?.[0] ? (
                            <Image
                              src={related.images[0]}
                              alt={related.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 50vw, 25vw"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-400 text-4xl">📷</span>
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <h4 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 text-sm">
                            {related.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            📸 {related.images?.length || 0} Foto
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #10b981;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #059669;
        }
      `}</style>
    </div>
  );
}


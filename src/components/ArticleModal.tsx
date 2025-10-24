'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, Calendar, Eye, User, Share2 } from 'lucide-react';

interface ArticleModalProps {
  articleId: string;
  onClose: () => void;
}

export default function ArticleModal({ articleId, onClose }: ArticleModalProps) {
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    fetchArticle();
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [articleId]);

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/articles/${articleId}`);
      if (response.ok) {
        const data = await response.json();
        setArticle(data);
        
        // Fetch related articles
        fetchRelatedArticles();
        
        // Increment views
        await fetch(`/api/articles/${articleId}/views`, { method: 'POST' });
      }
    } catch (error) {
      console.error('Error fetching article:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedArticles = async () => {
    try {
      const response = await fetch('/api/articles?limit=3');
      if (response.ok) {
        const data = await response.json();
        setRelatedArticles(data.filter((a: any) => a._id !== articleId).slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching related articles:', error);
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = () => {
    const url = `${window.location.origin}?article=${articleId}`;
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt || '',
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

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
            <p className="text-gray-600 font-medium">Memuat artikel...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md">
          <div className="text-center">
            <div className="text-6xl mb-4">😞</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Artikel Tidak Ditemukan</h3>
            <p className="text-gray-600 mb-6">Maaf, artikel yang Anda cari tidak tersedia.</p>
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn p-4"
      onClick={handleBackdropClick}
    >
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
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
              {article.title}
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
            {/* Article Header */}
            <div className="mb-8">
              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {article.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {article.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(article.createdAt)}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>{article.views} views</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{article.author?.name || 'Admin'}</span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {article.featuredImage && (
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg mb-8">
                <Image
                  src={article.featuredImage}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                />
              </div>
            )}

            {/* Excerpt */}
            {article.excerpt && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg mb-8">
                <p className="text-green-800 font-medium italic">
                  {article.excerpt}
                </p>
              </div>
            )}

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-green-600 prose-strong:text-gray-900"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Artikel Terkait</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedArticles.map((related) => (
                    <button
                      key={related._id}
                      onClick={() => {
                        onClose();
                        setTimeout(() => {
                          const element = document.querySelector(`[data-article-id="${related._id}"]`);
                          if (element) {
                            (element as HTMLElement).click();
                          }
                        }, 300);
                      }}
                      className="group text-left"
                    >
                      <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-all">
                        {related.featuredImage && (
                          <div className="relative aspect-video">
                            <Image
                              src={related.featuredImage}
                              alt={related.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <h4 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 mb-2">
                            {related.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {formatDate(related.createdAt)}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Author Info */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-lg">
                    {article.author?.name?.charAt(0) || 'A'}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {article.author?.name || 'Admin Desa Cepoko'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Admin Website Desa Cepoko
                  </p>
                </div>
              </div>
            </div>
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


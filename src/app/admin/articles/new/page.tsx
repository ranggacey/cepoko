'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageUpload from '@/components/Upload/ImageUpload';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function NewArticlePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    tags: '',
    published: false
  });

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-black">Memuat...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated' || session?.user?.role !== 'admin') {
    router.push('/cepoko');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const articleData = {
        ...formData,
        tags: tagsArray,
        author: session?.user?.id
      };

      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData),
      });

      if (response.ok) {
        const article = await response.json();
        router.push('/admin/articles');
      } else {
        alert('Gagal membuat artikel');
      }
    } catch (error) {
      console.error('Error creating article:', error);
      alert('Terjadi kesalahan saat membuat artikel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/admin/articles" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="font-bold text-xl text-black">Artikel Baru</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/articles"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                ← Kembali
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-black mb-4">Informasi Dasar</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-black mb-2">
                  Judul Artikel *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                  placeholder="Masukkan judul artikel"
                />
              </div>

              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-black mb-2">
                  Ringkasan
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  rows={3}
                  value={formData.excerpt}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-black"
                  placeholder="Ringkasan singkat artikel (opsional)"
                />
              </div>

              <ImageUpload
                onImageUpload={(url) => setFormData(prev => ({ ...prev, featuredImage: url }))}
                currentImage={formData.featuredImage}
                label="Featured Image"
                className=""
              />

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-black mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                  placeholder="desa, kegiatan, berita (pisahkan dengan koma)"
                />
                <p className="text-sm text-black mt-1">
                  Pisahkan setiap tag dengan koma
                </p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="published" className="ml-2 block text-sm text-black">
                  Publish artikel ini
                </label>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-black mb-4">Konten Artikel</h2>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-black mb-2">
                Konten *
              </label>
              <textarea
                id="content"
                name="content"
                required
                rows={20}
                value={formData.content}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none font-mono text-sm text-black"
                placeholder="Tuliskan konten artikel di sini..."
              />
              <p className="text-sm text-black mt-2">
                Anda bisa menggunakan HTML tags untuk formatting: &lt;h1&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, dll.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center">
              <Link
                href="/admin/articles"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Batal
              </Link>
              
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, published: false }))}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Simpan sebagai Draft
                </button>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Menyimpan...
                    </div>
                  ) : formData.published ? (
                    'Publish Artikel'
                  ) : (
                    'Simpan Draft'
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      </div>
    </ErrorBoundary>
  );
}

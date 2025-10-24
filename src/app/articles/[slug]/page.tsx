import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import { IArticle } from '@/models/Article';
import connectDB from '@/lib/mongodb';

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getArticle(slug: string): Promise<any | null> {
  try {
    await connectDB();
    const Article = (await import('@/models/Article')).default;
    
    const article = await Article.findOne({ slug, published: true })
      .populate('author', 'name email')
      .lean();

    return article;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

async function getRelatedArticles(currentSlug: string): Promise<any[]> {
  try {
    await connectDB();
    const Article = (await import('@/models/Article')).default;
    
    const articles = await Article.find({ 
      slug: { $ne: currentSlug }, 
      published: true 
    })
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    return articles;
  } catch (error) {
    console.error('Error fetching related articles:', error);
    return [];
  }
}

// Generate static params for all published articles
export async function generateStaticParams() {
  try {
    await connectDB();
    const Article = (await import('@/models/Article')).default;
    
    const articles = await Article.find({ published: true })
      .select('slug')
      .lean();

    return articles.map((article) => ({
      slug: article.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Enable dynamic params for articles created after build
export const dynamicParams = true;

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);
  
  if (!article) {
    return {
      title: 'Artikel Tidak Ditemukan',
    };
  }

  return {
    title: `${article.title} - Desa Cepoko`,
    description: article.excerpt || article.content.replace(/<[^>]*>/g, '').substring(0, 160),
    keywords: article.tags.join(', '),
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);
  const relatedArticles = await getRelatedArticles(slug);

  if (!article) {
    notFound();
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Increment view count (optional)
  try {
    await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/articles/${article._id}/views`, {
      method: 'POST',
    });
  } catch (error) {
    console.error('Error incrementing views:', error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Article Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-4">
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
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {article.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <span>📅</span>
                <span>{formatDate(article.createdAt)}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span>👁️</span>
                <span>{article.views} views</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span>✍️</span>
                <span>{(article.author as any)?.name || 'Admin'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {article.featuredImage && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 896px"
            />
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg p-8">
              {/* Excerpt */}
              {article.excerpt && (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-8">
                  <p className="text-green-800 font-medium italic">
                    {article.excerpt}
                  </p>
                </div>
              )}

              {/* Content */}
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Article Footer */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold text-lg">
                        {(article.author as any)?.name?.charAt(0) || 'A'}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {(article.author as any)?.name || 'Admin Desa Cepoko'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Admin Website Desa Cepoko
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>Terakhir diperbarui:</span>
                    <span>{formatDate(article.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Artikel Terkait</h3>
                  <div className="space-y-4">
                    {relatedArticles.map((relatedArticle) => (
                      <Link
                        key={relatedArticle._id.toString()}
                        href={`/articles/${relatedArticle.slug}`}
                        className="block group"
                      >
                        <div className="flex space-x-3">
                          <div className="flex-shrink-0">
                            {relatedArticle.featuredImage ? (
                              <Image
                                src={relatedArticle.featuredImage}
                                alt={relatedArticle.title}
                                width={60}
                                height={60}
                                className="rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-15 h-15 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-gray-500">📰</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 group-hover:text-green-600 line-clamp-2">
                              {relatedArticle.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(relatedArticle.createdAt)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Links */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Menu Utama</h3>
                <div className="space-y-3">
                  <Link
                    href="/"
                    className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">🏠</span>
                      <span className="font-medium text-gray-900">Beranda</span>
                    </div>
                  </Link>

                  <Link
                    href="/gallery"
                    className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">📸</span>
                      <span className="font-medium text-gray-900">Galeri Foto</span>
                    </div>
                  </Link>

                  <Link
                    href="/maps"
                    className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">🗺️</span>
                      <span className="font-medium text-gray-900">Peta Lokasi</span>
                    </div>
                  </Link>

                  <Link
                    href="/contact"
                    className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">📞</span>
                      <span className="font-medium text-gray-900">Hubungi Kami</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

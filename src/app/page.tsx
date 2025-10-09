import Link from 'next/link';
import { Camera, MapPin, Newspaper, Building2, Users, TrendingUp, Calendar } from 'lucide-react';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import Hero from '@/components/Hero';
import ImageSlider from '@/components/ImageSlider';
import ErrorBoundary from '@/components/ErrorBoundary';

// Fetch homepage slider images from database
async function getHomepageSliderImages() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/homepage-slider`, {
      cache: 'no-store' // Always get fresh data
    });
    
    if (response.ok) {
      const sliders = await response.json();
      return sliders.map((slider: any) => slider.imageUrl);
    }
  } catch (error) {
    console.error('Error fetching homepage slider images:', error);
  }
  
  // Fallback images if database fails
  return [
    '/images/desa-cepoko-1.jpg',
    '/images/desa-cepoko-2.jpg', 
    '/images/desa-cepoko-3.jpg',
    '/images/desa-cepoko-4.jpg',
    '/images/desa-cepoko-5.jpg'
  ];
}

export default async function Home() {
  const desaImages = await getHomepageSliderImages();

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
      
      <Hero />

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-black mb-2">3 RW</div>
              <div className="text-gray-600">Rukun Warga</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-black mb-2">17 RT</div>
              <div className="text-gray-600">Rukun Tetangga</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-black mb-2">3 Dusun</div>
              <div className="text-gray-600">Wilayah Dusun</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Informasi Desa Cepoko
            </h2>
            <p className="text-xl text-black">
              Temukan semua yang Anda butuhkan tentang Desa Cepoko
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Gallery Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Galeri Foto</h3>
              <p className="text-black mb-6">
                Lihat koleksi foto-foto indah Desa Cepoko, mulai dari pemandangan alam hingga kegiatan warga.
              </p>
              <Link
                href="/gallery"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
              >
                Lihat Galeri
              </Link>
            </div>

            {/* Maps Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Peta Lokasi</h3>
              <p className="text-black mb-6">
                Temukan lokasi RW, RT, fasilitas umum, dan tempat penting di Desa Cepoko dengan mudah.
              </p>
              <Link
                href="/maps"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
              >
                Lihat Peta
              </Link>
            </div>

            {/* Articles Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Newspaper className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Artikel & Berita</h3>
              <p className="text-black mb-6">
                Baca artikel dan berita terbaru tentang perkembangan dan kegiatan di Desa Cepoko.
              </p>
              <Link
                href="/articles"
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
              >
                Baca Artikel
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
                Tentang Desa Cepoko
              </h2>
              <p className="text-lg text-black mb-6">
                Desa Cepoko adalah sebuah desa yang terletak di Kecamatan Gunungpati, 
                Kota Semarang. Desa ini dikenal dengan keindahan alamnya dan keramahan warganya.
              </p>
              <p className="text-lg text-black mb-8">
                Website ini dibuat untuk memberikan informasi lengkap tentang Desa Cepoko, 
                mulai dari galeri foto, peta lokasi, hingga artikel terkini tentang perkembangan desa.
              </p>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">3</div>
                  <div className="text-black">RW</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">17</div>
                  <div className="text-black">RT</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">3</div>
                  <div className="text-black">Dusun</div>
                </div>
              </div>
            </div>
            <ImageSlider 
              images={desaImages}
              autoSlide={true}
              slideInterval={3000}
            />
          </div>
        </div>
      </section>

      {/* Recent Activities Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Kegiatan & Informasi Terbaru
            </h2>
            <p className="text-xl text-black">
              Pantau perkembangan dan kegiatan terbaru di Desa Cepoko
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Latest Articles */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <Newspaper className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-black">Artikel Terbaru</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Baca artikel dan berita terkini tentang perkembangan Desa Cepoko, kegiatan warga, dan informasi penting.
              </p>
              <Link
                href="/articles"
                className="text-purple-600 hover:text-purple-700 font-semibold inline-flex items-center"
              >
                Lihat Semua Artikel
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Photo Gallery */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <Camera className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-black">Galeri Foto</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Jelajahi koleksi foto-foto indah Desa Cepoko, mulai dari pemandangan alam, kegiatan warga, hingga dokumentasi acara.
              </p>
              <Link
                href="/gallery"
                className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center"
              >
                Lihat Galeri
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Location Info */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-black">Peta Lokasi</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Temukan lokasi RW, RT, fasilitas umum, dan tempat penting di Desa Cepoko dengan peta interaktif yang mudah digunakan.
              </p>
              <Link
                href="/maps"
                className="text-green-600 hover:text-green-700 font-semibold inline-flex items-center"
              >
                Lihat Peta
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Butuh Informasi Lebih Lanjut?
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Hubungi kami untuk pertanyaan atau informasi tentang Desa Cepoko
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-green-600 hover:bg-green-50 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Hubungi Kami
            </Link>
            <Link
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              WhatsApp
            </Link>
          </div>
        </div>
      </section>

        <Footer />
      </div>
    </ErrorBoundary>
  );
}
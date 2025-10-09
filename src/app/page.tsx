import Link from 'next/link';
import { Camera, MapPin, Newspaper, Building2 } from 'lucide-react';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function Home() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Selamat Datang di Desa Cepoko
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              Desa yang indah di Gunungpati, Semarang
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/gallery"
                className="bg-white text-green-600 hover:bg-green-50 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Lihat Galeri
              </Link>
              <Link
                href="/maps"
                className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Peta Lokasi
              </Link>
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
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
                  <div className="text-black">RW & RT</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">1000+</div>
                  <div className="text-black">Warga</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-200 rounded-xl h-96 flex items-center justify-center">
              <div className="text-center">
                <Building2 className="w-16 h-16 text-gray-500 mx-auto mb-2" />
                <span className="text-black text-lg">Foto Desa Cepoko</span>
              </div>
            </div>
          </div>
        </div>
      </section>

        <Footer />
      </div>
    </ErrorBoundary>
  );
}
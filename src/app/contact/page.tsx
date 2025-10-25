'use client';

import { Mail, Phone, MapPin, Building, Camera, Newspaper, MessageCircle } from 'lucide-react';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';

export default function ContactPage() {

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-black">Hubungi Kami</h1>
            <p className="text-black mt-2">
              Informasi kontak dan layanan pengaduan Desa Cepoko
            </p>
          </div>
        </div>
      </div>

      {/* Contact Form & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Kontak Langsung */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-black mb-6">Kontak Langsung</h2>
              
              <div className="space-y-6">
                {/* WhatsApp */}
                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-black mb-2">WhatsApp Desa Cepoko</h3>
                      <p className="text-gray-600 mb-4">
                        Hubungi kami langsung melalui WhatsApp untuk pertanyaan cepat dan informasi terkini.
                      </p>
                      <a 
                        href="https://wa.me/6281234567890" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        <span className="mr-2">Chat WhatsApp</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Telepon Langsung */}
                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-black mb-2">Telepon Langsung</h3>
                      <p className="text-gray-600 mb-4">
                        Hubungi kantor desa untuk pertanyaan langsung dan informasi layanan.
                      </p>
                      <div className="flex items-center space-x-4">
                        <div className="inline-flex items-center bg-gray-300 text-gray-600 px-4 py-2 rounded-lg font-medium cursor-not-allowed">
                          <Phone className="w-4 h-4 mr-2" />
                          <span>-</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          Jam kerja: Senin-Jumat 08:00-16:00
                        </span>
                  </div>
                </div>
                  </div>
                </div>

                {/* Email */}
                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-purple-600" />
                  </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-black mb-2">Email Resmi</h3>
                      <p className="text-gray-600 mb-4">
                        Kirim email untuk pertanyaan formal, dokumen, dan surat menyurat.
                      </p>
                      <div className="inline-flex items-center bg-gray-300 text-gray-600 px-4 py-2 rounded-lg font-medium cursor-not-allowed">
                        <Mail className="w-4 h-4 mr-2" />
                        <span>-</span>
                      </div>
                    </div>
                  </div>
                </div>
                    </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {/* Office Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-black mb-4">Informasi Kontak</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Alamat</p>
                    <p className="text-gray-600 text-sm">
                      Kantor Desa Cepoko<br />
                      Gunungpati, Semarang<br />
                      Jawa Tengah
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Telepon</p>
                    <p className="text-gray-600 text-sm">-</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-600 text-sm">-</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Building className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Jam Kerja</p>
                    <p className="text-gray-600 text-sm">
                      Senin - Jumat: 08:00 - 16:00<br />
                      Sabtu: 08:00 - 12:00
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Tautan Cepat</h3>
              
              <div className="space-y-3">
                <a href="/maps" className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Peta Lokasi</p>
                      <p className="text-sm text-gray-600">Temukan lokasi RW/RT</p>
                    </div>
                  </div>
                </a>

                <a href="/gallery" className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <Camera className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Galeri Foto</p>
                      <p className="text-sm text-gray-600">Lihat foto-foto desa</p>
                    </div>
                  </div>
                </a>

                <a href="/articles" className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <Newspaper className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Artikel & Berita</p>
                      <p className="text-sm text-gray-600">Info terkini desa</p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

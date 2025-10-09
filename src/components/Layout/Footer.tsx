import Link from 'next/link';
import { MapPin, Mail, Phone, Building, Heart } from 'lucide-react';
import { Container } from '@/components/ui/container';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <Container size="2xl" className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-bold text-xl">Desa Cepoko</span>
            </div>
            <p className="text-gray-200 mb-4">
              Website resmi Desa Cepoko, Gunungpati. Menyediakan informasi terkini tentang desa, 
              galeri foto, dan peta lokasi untuk memudahkan warga dan pengunjung.
            </p>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-300" />
              <span className="text-sm text-gray-300">Gunungpati, Semarang</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Menu Utama</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-300 hover:text-white transition-colors">
                  Galeri Foto
                </Link>
              </li>
              <li>
                <Link href="/maps" className="text-gray-300 hover:text-white transition-colors">
                  Peta Lokasi
                </Link>
              </li>
              <li>
                <Link href="/articles" className="text-gray-300 hover:text-white transition-colors">
                  Artikel
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Kontak</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>info@desacepoko.id</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+62 XXX-XXXX-XXXX</span>
              </li>
              <li className="flex items-center space-x-2">
                <Building className="w-4 h-4" />
                <span>Kantor Desa Cepoko</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Gunungpati, Semarang</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm flex items-center justify-center space-x-1">
            <span>© 2025 Desa Cepoko, Gunungpati</span>
          </p>
        </div>
      </Container>
    </footer>
  );
}

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Mail, Phone, Building, Heart } from 'lucide-react';
import { Container } from '@/components/ui/container';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white" style={{color: 'white !important'}}>
      <Container size="2xl" className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Image
                src="/images/logo.jpg"
                alt="Desa Cepoko Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="font-bold text-xl">Kelurahan Cepoko</span>
            </div>
            <p className="text-white mb-4" style={{color: 'white !important'}}>
              <span style={{color: 'white !important'}}>Website resmi Desa Cepoko, Gunungpati. Menyediakan informasi terkini tentang desa, 
              galeri foto, dan peta lokasi untuk memudahkan warga dan pengunjung.</span>
            </p>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-white" />
              <span className="text-sm text-white">Gunungpati, Semarang</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Menu Utama</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-white hover:text-green-400 transition-colors no-underline" style={{color: 'white !important'}}>
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-white hover:text-green-400 transition-colors no-underline" style={{color: 'white !important'}}>
                  Galeri Foto
                </Link>
              </li>
              <li>
                <Link href="/maps" className="text-white hover:text-green-400 transition-colors no-underline" style={{color: 'white !important'}}>
                  Peta Lokasi
                </Link>
              </li>
              <li>
                <Link href="/articles" className="text-white hover:text-green-400 transition-colors no-underline" style={{color: 'white !important'}}>
                  Artikel
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Kontak</h3>
            <ul className="space-y-2 text-white">
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-white" />
                <span>info@desacepoko.id</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-white" />
                <span>+62 XXX-XXXX-XXXX</span>
              </li>
              <li className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-white" />
                <span>Kantor Desa Cepoko</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-white" />
                <span>Gunungpati, Semarang</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white mt-8 pt-8 text-center">
          <p className="text-white text-sm flex items-center justify-center space-x-1" style={{color: 'white !important'}}>
            <span>© 2025 Desa Cepoko, Gunungpati</span>
          </p>
        </div>
      </Container>
    </footer>
  );
}

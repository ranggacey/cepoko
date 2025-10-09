'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, Settings, LogOut } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { href: '/', label: 'Beranda' },
    { href: '/gallery', label: 'Galeri' },
    { href: '/maps', label: 'Peta Lokasi' },
    { href: '/articles', label: 'Artikel' },
    { href: '/contact', label: 'Kontak' },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-bold text-xl text-black">Desa Cepoko</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-green-600 bg-green-50'
                    : 'text-black hover:text-green-600 hover:bg-green-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Admin Section */}
          <div className="flex items-center space-x-4">
            {status === 'authenticated' && session?.user?.role === 'admin' && (
              <div className="flex items-center space-x-3">
                <Link
                  href="/admin"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Admin Panel
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-black hover:text-gray-900 text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-black hover:text-gray-900 focus:outline-none focus:text-gray-900"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

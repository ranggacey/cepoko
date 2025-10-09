'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, Settings, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

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
                    ? 'text-black bg-gray-100 font-semibold'
                    : 'text-black hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Admin Section - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {status === 'authenticated' && session?.user?.role === 'admin' && (
              <div className="flex items-center space-x-3">
                <Link
                  href="/admin"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Settings className="h-4 w-4 inline-block mr-1" /> Admin Panel
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-black hover:text-gray-900 text-sm font-medium transition-colors"
                >
                  <LogOut className="h-4 w-4 inline-block mr-1" /> Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="text-black hover:text-gray-900 focus:outline-none focus:text-gray-900"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200 shadow-lg">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'text-black bg-gray-100 font-semibold'
                    : 'text-black hover:text-gray-700 hover:bg-gray-50'
                }`}
                style={{
                  animationDelay: isMobileMenuOpen ? `${index * 50}ms` : '0ms',
                  transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(-10px)',
                  opacity: isMobileMenuOpen ? 1 : 0,
                  transition: 'all 0.2s ease-out'
                }}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Mobile Admin Section */}
            {status === 'authenticated' && session?.user?.role === 'admin' && (
              <div 
                className="border-t border-gray-200 pt-2 mt-2"
                style={{
                  animationDelay: isMobileMenuOpen ? `${navItems.length * 50}ms` : '0ms',
                  transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(-10px)',
                  opacity: isMobileMenuOpen ? 1 : 0,
                  transition: 'all 0.2s ease-out'
                }}
              >
                <Link
                  href="/admin"
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 rounded-md text-base font-medium text-green-600 hover:bg-green-50 transition-colors"
                >
                  <Settings className="h-4 w-4 inline-block mr-2" /> Admin Panel
                </Link>
                <button
                  onClick={() => {
                    closeMobileMenu();
                    signOut();
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-black hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  <LogOut className="h-4 w-4 inline-block mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

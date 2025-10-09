'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, Settings, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Container } from '@/components/ui/container';

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
    <nav className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-100 sticky top-0 z-50">
      <Container size="2xl">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Desa Cepoko</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-gray-900 bg-gray-100 font-semibold'
                    : 'text-gray-900 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="relative z-10">{item.label}</span>
                <span
                  className={`absolute left-3 right-3 -bottom-0.5 h-[2px] rounded bg-green-600 transition-all duration-300 ease-out ${
                    isActive(item.href) ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:opacity-100'
                  }`}
                  style={{ transformOrigin: 'left' }}
                />
              </Link>
            ))}
          </div>

          {/* Admin Section - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            {status === 'authenticated' && session?.user?.role === 'admin' && (
              <div className="flex items-center space-x-3">
                <Link
                  href="/admin"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
                >
                  <Settings className="h-4 w-4 inline-block mr-1" /> Admin Panel
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-gray-900 hover:text-gray-700 text-sm font-medium transition-colors"
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
              className="text-gray-900 hover:text-gray-700 focus:outline-none"
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
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-100 shadow-lg">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'text-gray-900 bg-gray-100 font-semibold'
                    : 'text-gray-900 hover:text-gray-700 hover:bg-gray-50'
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
                className="border-t border-gray-100 pt-2 mt-2"
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
                  className="block px-3 py-2 rounded-md text-base font-medium text-green-700 hover:bg-green-50 transition-colors"
                >
                  <Settings className="h-4 w-4 inline-block mr-2" /> Admin Panel
                </Link>
                <button
                  onClick={() => {
                    closeMobileMenu();
                    signOut();
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <LogOut className="h-4 w-4 inline-block mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </nav>
  );
}

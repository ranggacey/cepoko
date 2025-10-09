import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";
import { Providers } from './providers';
import ErrorBoundary from '@/components/ErrorBoundary';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Desa Cepoko - Gunungpati",
  description: "Website resmi Desa Cepoko, Gunungpati. Informasi desa, galeri foto, dan peta lokasi RW/RT.",
  keywords: "Desa Cepoko, Gunungpati, RW, RT, kelurahan, fasilitas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}

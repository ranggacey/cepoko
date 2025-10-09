'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient + subtle shapes */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-green-50 to-white" />
      <div className="absolute -top-40 right-0 -z-10 h-[480px] w-[480px] rounded-full bg-green-200/40 blur-3xl" />
      <div className="absolute -bottom-40 left-0 -z-10 h-[420px] w-[420px] rounded-full bg-emerald-200/40 blur-3xl" />

      <Container size="2xl" className="py-16 sm:py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900"
            >
              Desa Cepoko
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Hidup & Berkembang</span>
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 text-lg text-gray-700 max-w-prose"
            >
              Informasi kegiatan, layanan, peta lokasi RW/RT, dan galeri warga—
              semua dalam satu tempat dengan pengalaman yang halus dan cepat.
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 flex items-center gap-3"
            >
              <Button asChild>
                <Link href="/maps">Lihat Peta</Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/gallery">Galeri Kegiatan</Link>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-6 text-sm text-gray-500"
            >
              Data diperbarui berkala. Hubungi kami jika ada saran.
            </motion.div>
          </div>

          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5">
              <Image
                src="/images/desa-cepoko-1.jpg"
                alt="Panorama Desa Cepoko"
                fill
                priority
                sizes="(min-width: 1024px) 560px, 100vw"
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}



# Setup Vercel Blob Storage untuk Upload Images

## Masalah
Di Vercel production, filesystem bersifat **read-only**, sehingga tidak bisa menyimpan file yang diupload user. Error yang muncul:
```
Error: EROFS: read-only file system
```

## Solusi: Vercel Blob Storage

### 1. Setup di Vercel Dashboard

1. **Login ke Vercel Dashboard**
   - Buka https://vercel.com/dashboard

2. **Buka Project Anda**
   - Pilih project `cepokoV2`

3. **Buat Blob Store**
   - Pergi ke tab **Storage**
   - Klik **Create Database**
   - Pilih **Blob**
   - Beri nama: `cepoko-uploads` atau nama lain
   - Klik **Create**

4. **Connect ke Project**
   - Setelah Blob Store dibuat, klik **Connect to Project**
   - Pilih project `cepokoV2`
   - Klik **Connect**

5. **Copy Token**
   - Setelah connect, akan muncul environment variable:
   ```
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
   ```
   - Token ini otomatis tersimpan di Environment Variables project Anda

### 2. Verifikasi Environment Variables

1. Buka **Settings** → **Environment Variables**
2. Pastikan ada variable:
   - `BLOB_READ_WRITE_TOKEN` = `vercel_blob_rw_xxxxxxxxxxxxx`

### 3. Redeploy

1. Pergi ke tab **Deployments**
2. Klik pada deployment terbaru
3. Klik menu ⋮ (three dots)
4. Pilih **Redeploy**
5. Tunggu deployment selesai

### 4. Test Upload

1. Buka website production: https://cepoko.vercel.app/admin
2. Login sebagai admin
3. Coba upload image di Articles/Galleries/Locations
4. Jika berhasil, image akan tersimpan di Vercel Blob Storage

## Cara Kerja

### Development (Local)
- Upload menggunakan **local filesystem**
- File tersimpan di folder `public/uploads/`
- URL: `/uploads/filename.jpg`

### Production (Vercel)
- Upload menggunakan **Vercel Blob Storage**
- File tersimpan di cloud
- URL: `https://xxxxxxxxxx.public.blob.vercel-storage.com/filename.jpg`

## Pricing

Vercel Blob Storage **GRATIS** untuk:
- 1 GB storage
- 10 GB bandwidth per bulan

Cukup untuk website desa dengan traffic normal.

## Notes

- Tidak perlu setup apapun untuk local development
- Local development tetap menggunakan filesystem seperti biasa
- Hanya di production yang otomatis pakai Vercel Blob Storage


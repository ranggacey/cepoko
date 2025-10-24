# ✅ Vercel Deployment Checklist

## 1. Environment Variables

Buka **Vercel Dashboard** → **Settings** → **Environment Variables**

Pastikan semua variable ini sudah diset:

### Required Variables:

- [ ] **MONGODB_URI**
  ```
  mongodb+srv://username:password@cluster.mongodb.net/cepoko
  ```
  - Dapatkan dari MongoDB Atlas
  - HARUS menggunakan MongoDB Atlas untuk production (bukan localhost)

- [ ] **NEXTAUTH_SECRET**
  ```
  (Generate random string yang kuat, minimal 32 karakter)
  ```
  - Generate dengan: `openssl rand -base64 32`
  - Atau gunakan: https://generate-secret.vercel.app/32

- [ ] **NEXTAUTH_URL**
  ```
  https://cepoko.vercel.app
  ```
  - URL production website Anda

- [ ] **BLOB_READ_WRITE_TOKEN**
  ```
  vercel_blob_rw_xxxxxxxxxxxxx
  ```
  - Untuk upload images di production
  - Lihat panduan di `VERCEL_SETUP.md`

## 2. MongoDB Atlas Setup

Jika belum setup MongoDB Atlas:

1. **Buat Account MongoDB Atlas**
   - Buka: https://www.mongodb.com/cloud/atlas
   - Sign up gratis

2. **Buat Cluster**
   - Pilih **FREE Shared Cluster** (M0)
   - Pilih region terdekat (Singapore/Jakarta)

3. **Setup Database Access**
   - Database Access → Add New Database User
   - Username: `cepoko-admin`
   - Password: (buat password yang kuat)
   - Database User Privileges: **Read and write to any database**

4. **Setup Network Access**
   - Network Access → Add IP Address
   - Pilih **Allow Access from Anywhere** (0.0.0.0/0)
   - Atau tambahkan IP Vercel jika ingin lebih secure

5. **Get Connection String**
   - Clusters → Connect → Drivers
   - Copy connection string:
     ```
     mongodb+srv://cepoko-admin:<password>@cluster0.xxxxx.mongodb.net/cepoko
     ```
   - Replace `<password>` dengan password yang Anda buat

6. **Set di Vercel**
   - Paste connection string ke `MONGODB_URI` environment variable

## 3. Setelah Environment Variables Diset

### Redeploy Project:

1. Vercel Dashboard → **Deployments**
2. Klik deployment terbaru
3. Klik menu ⋮ (three dots)
4. Pilih **Redeploy**
5. Tunggu deployment selesai

## 4. Setup Admin User di Production

Pilih salah satu:

### Opsi A: Menggunakan Seed Endpoint

1. Buka browser, akses:
   ```
   https://cepoko.vercel.app/api/seed
   ```
2. Ini akan membuat admin user + sample data
3. **Login credentials:**
   - Email: `admin@desacepoko.id`
   - Password: `cepoko619619`

⚠️ **WARNING**: Endpoint ini akan menghapus semua data yang ada!

### Opsi B: Create Admin via API

1. Buka browser, akses:
   ```
   https://cepoko.vercel.app/api/admin/create-admin
   ```
2. Ini hanya membuat admin user, tanpa menghapus data
3. **Login credentials:**
   - Email: `admin@desacepoko.id`
   - Password: `cepoko619619`

## 5. Test Production Website

- [ ] Buka: https://cepoko.vercel.app
- [ ] Cek homepage loading dengan benar
- [ ] Login ke admin: https://cepoko.vercel.app/admin/login
- [ ] Test upload image di admin panel
- [ ] Buat artikel baru dan publish
- [ ] Cek artikel bisa dibuka
- [ ] Test semua menu navigasi

## 6. Troubleshooting

### Error 404 pada Artikel/Gallery:

**Penyebab:** Artikel/Gallery belum ada di database production

**Solusi:**
1. Login ke admin panel production
2. Buat artikel/gallery baru
3. Publish

### Error "MONGODB_URI not defined":

**Penyebab:** Environment variable belum diset

**Solusi:**
1. Set `MONGODB_URI` di Vercel environment variables
2. Redeploy

### Error "EROFS: read-only file system" saat upload:

**Penyebab:** `BLOB_READ_WRITE_TOKEN` belum diset

**Solusi:**
1. Setup Vercel Blob Storage (lihat `VERCEL_SETUP.md`)
2. Set `BLOB_READ_WRITE_TOKEN`
3. Redeploy

### Database Connection Timeout:

**Penyebab:** IP Vercel belum di-whitelist di MongoDB Atlas

**Solusi:**
1. MongoDB Atlas → Network Access
2. Allow Access from Anywhere (0.0.0.0/0)

## 7. Security Recommendations

Setelah website live:

- [ ] Ganti admin password default
- [ ] Gunakan password yang kuat
- [ ] Jangan share credentials
- [ ] Backup database secara berkala
- [ ] Monitor usage di MongoDB Atlas dashboard

## 8. Maintenance

### Regular Tasks:

- Check MongoDB Atlas usage (free tier: 512MB storage)
- Check Vercel Blob Storage usage (free tier: 1GB)
- Backup database sebelum update besar
- Update dependencies secara berkala

## Need Help?

Jika masih ada masalah:

1. Check Vercel Deployment Logs:
   - Vercel Dashboard → Deployments → Click deployment → Logs

2. Check Runtime Logs:
   - Vercel Dashboard → Deployments → Click deployment → Functions logs

3. Common issues dan solusi ada di:
   - `VERCEL_SETUP.md` - untuk upload images
   - `README.md` - untuk setup project

---

**Last Updated:** October 2025


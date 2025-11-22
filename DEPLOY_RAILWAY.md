# 🚀 Deploy CardioCare AI dengan Railway + Vercel
## Railway (Backend) + Vercel (Frontend)

---

## ⚡ STEP 1: Deploy Backend ke Railway (5 MENIT!)

### 1.1 Buat Akun Railway

1. Buka [railway.app](https://railway.app)
2. Klik **"Login"**
3. Pilih **"Login with GitHub"**
4. Authorize Railway untuk akses GitHub
5. Verifikasi email jika diminta

### 1.2 Deploy Backend

1. Di Railway Dashboard, klik **"New Project"**
2. Pilih **"Deploy from GitHub repo"**
3. Klik **"Configure GitHub App"** (jika pertama kali)
4. Pilih repository **"cardiocare"**
5. Railway akan auto-detect Python project
6. Klik **"Deploy Now"**

**Railway akan otomatis:**
- ✅ Detect Python
- ✅ Install dependencies dari `requirements.txt`
- ✅ Run dengan Gunicorn
- ✅ Generate public URL

### 1.3 Tunggu Deploy Selesai

1. Tunggu 2-3 menit (Railway install dependencies)
2. Status berubah dari "Building" → "Active" ✅
3. Jika ada error, klik "View Logs" untuk lihat detail

### 1.4 Set Root Directory (PENTING!)

Karena backend ada di folder `backend/`:

1. Di project Railway, klik tab **"Settings"**
2. Scroll ke **"Service Settings"**
3. Cari **"Root Directory"**
4. Isi dengan: `backend`
5. Klik **"Save"**
6. Railway akan redeploy otomatis

### 1.5 Generate Public URL

1. Klik tab **"Settings"**
2. Scroll ke **"Networking"** section
3. Klik **"Generate Domain"**
4. Railway akan generate URL seperti:
   ```
   https://cardiocare-production.up.railway.app
   ```
   atau
   ```
   https://cardiocare-production-xxxx.up.railway.app
   ```

5. **CATAT URL INI!** Anda akan pakai untuk frontend.

### 1.6 Test Backend

Buka browser, akses URL Railway Anda + `/predict`:
```
https://your-app.up.railway.app/predict
```

Jika muncul error method (karena GET), artinya **BACKEND BERHASIL!** ✅

---

## 📋 STEP 2: Deploy Frontend ke Vercel (5 MENIT!)

### 2.1 Update API URL

1. Edit file `frontend/.env.production`
2. Ganti dengan URL Railway Anda:

```env
VITE_API_URL=https://cardiocare-production.up.railway.app
```

**GANTI** dengan URL Railway yang Anda dapat!

### 2.2 Commit dan Push

```powershell
cd "d:\Lomba\Web Hipertensi"
git add .
git commit -m "Update API URL for Railway"
git push origin main
```

### 2.3 Deploy ke Vercel

1. Login [vercel.com](https://vercel.com) dengan GitHub
2. Klik **"Add New..."** → **"Project"**
3. Import repository **"cardiocare"**
4. Klik **"Import"**

**Configure Project:**
```
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

**Environment Variables:**
Tambahkan:
```
Name: VITE_API_URL
Value: https://cardiocare-production.up.railway.app
```
*(Ganti dengan URL Railway Anda)*

5. Klik **"Deploy"**
6. Tunggu 2-3 menit

### 2.4 Selesai! 🎉

- ✅ Frontend: `https://cardiocare-xxx.vercel.app`
- ✅ Backend: `https://cardiocare-production.up.railway.app`

---

## 🧪 Testing

1. Buka URL Vercel Anda
2. Isi form prediksi dengan data lengkap
3. Klik "Lihat Hasil Prediksi"
4. Jika berhasil, hasil prediksi akan muncul! 🎉

---

## 🔧 Troubleshooting

### ❌ Railway: Build Failed

**Cek Logs:**
1. Klik "Deployments" tab
2. Klik deployment yang failed
3. Klik "View Logs"
4. Lihat error message

**Solusi umum:**
- Pastikan `requirements.txt` benar
- Pastikan `Procfile` ada di folder `backend/`
- Pastikan Root Directory sudah di-set ke `backend`

### ❌ Railway: Application Error

**Solusi:**
1. Pastikan file `hypertension_model.json` ada di repository
2. Cek logs untuk error detail
3. Pastikan CORS configuration sudah benar di `app.py`

### ❌ Frontend: Cannot connect to backend

**Cek:**
1. URL Railway di `.env.production` benar?
2. Test backend URL langsung di browser
3. Cek browser console (F12) untuk error
4. Pastikan CORS sudah allow domain Vercel

### ❌ CORS Error

Edit `backend/app.py`, pastikan CORS allow semua domain (untuk testing):

```python
CORS(app, resources={r"/*": {"origins": "*"}})
```

Lalu push ke GitHub, Railway akan auto-redeploy.

---

## 💰 Railway Free Tier

Railway memberikan:
- ✅ **$5 credit per bulan** (gratis)
- ✅ Cukup untuk small app seperti ini
- ✅ No credit card required
- ✅ Auto-deploy from GitHub
- ✅ No cold start (always on)

**Usage monitor:** Lihat di Railway dashboard → "Usage" tab

Jika credit habis (unlikely untuk app ini), upgrade ke $5/bulan.

---

## 🔄 Update Code (Auto-Deploy!)

**Setiap kali push ke GitHub:**
- Railway otomatis redeploy backend ✅
- Vercel otomatis redeploy frontend ✅

```powershell
git add .
git commit -m "Update feature"
git push origin main
```

**Tunggu 2-3 menit, changes LIVE!** 🚀

---

## 📊 Railway vs PythonAnywhere

| Feature | Railway | PythonAnywhere |
|---------|---------|----------------|
| Setup | 5 menit | 15 menit |
| Disk Space | Lebih besar | 512MB (sering penuh) |
| Auto Deploy | ✅ Ya | ❌ Manual |
| Cold Start | ❌ Tidak ada | ❌ Tidak ada |
| Free Tier | $5 credit/bulan | Unlimited |
| Speed | ⚡ Cepat | 🐌 Lambat |

**Railway = WINNER untuk project ini!** 🏆

---

## 🎉 Selesai!

Aplikasi Anda sekarang **PRODUCTION-READY**!

**URLs:**
- 🌐 Frontend: `https://cardiocare-xxx.vercel.app`
- ⚙️ Backend API: `https://cardiocare-production.up.railway.app`

**Share link Vercel untuk demo lomba! 🚀**

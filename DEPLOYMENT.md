# 🚀 Panduan Deployment CardioCare AI

## 📌 Arsitektur Deployment

```
Frontend (React + Vite) → Vercel
Backend (Flask + XGBoost) → Render/Railway
```

---

## 🎯 STEP 1: Deploy Backend ke Render

### 1.1 Buat akun di [Render.com](https://render.com)

### 1.2 Persiapkan Backend
Pastikan file `backend/requirements.txt` sudah lengkap.

### 1.3 Deploy ke Render
1. Login ke Render Dashboard
2. Klik **"New +"** → **"Web Service"**
3. Connect Repository GitHub Anda
4. Atur konfigurasi:
   ```
   Name: cardiocare-backend
   Region: Singapore (atau terdekat)
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: gunicorn app:app
   Instance Type: Free
   ```
5. Tambahkan Environment Variable (jika diperlukan)
6. Klik **"Create Web Service"**

### 1.4 Catat URL Backend
Setelah deploy selesai, salin URL (contoh: `https://cardiocare-backend.onrender.com`)

### 1.5 Update Backend untuk Production

Tambahkan Gunicorn ke `requirements.txt`:
```txt
flask==3.0.0
flask-cors==4.0.0
xgboost==2.0.3
numpy==1.26.2
gunicorn==21.2.0
```

Buat file `backend/gunicorn_config.py`:
```python
bind = "0.0.0.0:5000"
workers = 2
threads = 2
timeout = 120
```

---

## 🎯 STEP 2: Deploy Frontend ke Vercel

### 2.1 Buat akun di [Vercel.com](https://vercel.com)

### 2.2 Update API URL di Frontend

Edit `frontend/app.jsx`, ganti URL backend:
```javascript
// Ganti ini:
const response = await fetch('http://localhost:5000/predict', {

// Jadi:
const response = await fetch('https://cardiocare-backend.onrender.com/predict', {
```

Atau gunakan environment variable (lebih baik):
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const response = await fetch(`${API_URL}/predict`, {
```

Lalu update `frontend/.env.production`:
```
VITE_API_URL=https://cardiocare-backend.onrender.com
```

### 2.3 Deploy ke Vercel

**Via GitHub (Recommended):**
1. Push code ke GitHub
2. Login ke Vercel Dashboard
3. Klik **"Add New Project"**
4. Import repository GitHub Anda
5. Atur konfigurasi:
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```
6. Tambahkan Environment Variable:
   ```
   VITE_API_URL = https://cardiocare-backend.onrender.com
   ```
7. Klik **"Deploy"**

**Via Vercel CLI:**
```powershell
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel --prod
```

---

## 🎯 STEP 3: Testing

1. Buka URL Vercel Anda (contoh: `https://cardiocare.vercel.app`)
2. Isi form prediksi
3. Cek apakah koneksi ke backend berhasil
4. Jika error CORS, pastikan backend sudah enable CORS untuk domain Vercel

---

## 🔧 Troubleshooting

### ❌ CORS Error
Tambahkan di `backend/app.py`:
```python
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:5173",
            "https://cardiocare.vercel.app",  # Ganti dengan domain Vercel Anda
            "https://*.vercel.app"
        ]
    }
})
```

### ❌ Backend Cold Start (Render Free Tier)
Render free tier sleep setelah 15 menit tidak digunakan. 
- First request akan lambat (30 detik)
- Solusi: Upgrade ke paid plan atau gunakan Railway

### ❌ Model File Too Large
Jika model >100MB, gunakan Git LFS atau hosting terpisah:
```powershell
git lfs install
git lfs track "*.json"
```

---

## 📊 Alternative: Railway untuk Backend

Railway lebih cepat dari Render free tier:

1. Buat akun [Railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select repository
4. Add Service → Python
5. Atur:
   ```
   Root Directory: backend
   Start Command: gunicorn app:app
   ```
6. Deploy otomatis

---

## 🎉 Selesai!

Frontend: `https://cardiocare.vercel.app`
Backend: `https://cardiocare-backend.onrender.com`

**Catatan:** Ganti URL sesuai deployment Anda.

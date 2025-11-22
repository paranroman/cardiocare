# 🚀 Deploy CardioCare AI
## Vercel (Frontend) + PythonAnywhere (Backend)

---

## 📋 STEP 1: Deploy Backend ke PythonAnywhere

### 1.1 Buat Akun PythonAnywhere

1. Buka [www.pythonanywhere.com](https://www.pythonanywhere.com)
2. Klik **"Pricing & signup"**
3. Pilih **"Create a Beginner account"** (FREE FOREVER)
4. Isi form registrasi (email, username, password)
5. Verifikasi email
6. Login ke dashboard

### 1.2 Upload File Backend

**Opsi A: Via Upload (Mudah)**

1. Di dashboard PythonAnywhere, klik **"Files"**
2. Klik **"Upload a file"**
3. Upload semua file di folder `backend/`:
   - `app.py`
   - `requirements.txt`
   - `gunicorn_config.py`
   - `hypertension_model.json`
4. File akan tersimpan di `/home/your_username/`

**Opsi B: Via Git (Recommended)**

1. Di dashboard, klik **"Consoles"** → **"Bash"**
2. Jalankan command:
   ```bash
   git clone https://github.com/paranroman/cardiocare.git
   cd cardiocare/backend
   ```

### 1.3 Setup Virtual Environment

Di Bash console PythonAnywhere:

```bash
# Pindah ke home directory
cd ~

# Buat virtual environment
mkvirtualenv --python=/usr/bin/python3.10 cardiocare-env

# Install dependencies
cd ~/cardiocare/backend  # atau sesuai lokasi file Anda
pip install -r requirements.txt
```

**Tunggu hingga selesai** (bisa 5-10 menit untuk install XGBoost)

### 1.4 Konfigurasi Web App

1. Di dashboard, klik **"Web"**
2. Klik **"Add a new web app"**
3. Klik **"Next"** (domain akan otomatis: `your_username.pythonanywhere.com`)
4. Pilih **"Manual configuration"**
5. Pilih **"Python 3.10"**
6. Klik **"Next"**

### 1.5 Edit WSGI Configuration File

1. Di halaman Web tab, scroll ke **"Code"** section
2. Klik link **WSGI configuration file** (contoh: `/var/www/your_username_pythonanywhere_com_wsgi.py`)
3. **HAPUS semua isi file**, lalu ganti dengan:

```python
import sys
import os

# Path ke folder backend Anda
path = '/home/your_username/cardiocare/backend'  # GANTI your_username
if path not in sys.path:
    sys.path.append(path)

# Virtual environment
virtualenv_path = '/home/your_username/.virtualenvs/cardiocare-env'  # GANTI your_username
activate_this = os.path.join(virtualenv_path, 'bin/activate_this.py')
exec(open(activate_this).read(), dict(__file__=activate_this))

# Import Flask app
from app import app as application
```

**PENTING:** Ganti `your_username` dengan username PythonAnywhere Anda di 2 tempat!

4. Klik **"Save"**

### 1.6 Set Working Directory

1. Masih di halaman Web tab
2. Di section **"Code"**, edit **"Working directory"**
3. Isi dengan path backend: `/home/your_username/cardiocare/backend`
4. Klik **"Save"**

### 1.7 Enable CORS untuk Domain Vercel

Edit file `app.py` di PythonAnywhere:

1. Klik **"Files"** → buka `cardiocare/backend/app.py`
2. Update bagian CORS:

```python
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:5173",
            "https://*.vercel.app",
            "https://vercel.app"
        ],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})
```

3. Klik **"Save"**

### 1.8 Reload Web App

1. Kembali ke tab **"Web"**
2. Scroll ke atas
3. Klik tombol besar **"Reload your_username.pythonanywhere.com"**
4. Tunggu hingga muncul notifikasi sukses

### 1.9 Test Backend

Buka browser, akses:
```
https://your_username.pythonanywhere.com/predict
```

Jika muncul response (walaupun error karena method GET), artinya backend sudah jalan! ✅

**Catat URL Backend Anda:**
```
https://your_username.pythonanywhere.com
```

---

## 📋 STEP 2: Deploy Frontend ke Vercel

### 2.1 Update API URL

1. Buka file `frontend/.env.production`
2. Update dengan URL PythonAnywhere Anda:

```env
VITE_API_URL=https://your_username.pythonanywhere.com
```

**GANTI** `your_username` dengan username PythonAnywhere Anda!

### 2.2 Commit dan Push ke GitHub

```powershell
cd "d:\Lomba\Web Hipertensi"
git add .
git commit -m "Update API URL for PythonAnywhere"
git push origin main
```

### 2.3 Deploy ke Vercel

**Via Dashboard (Recommended):**

1. Buka [vercel.com](https://vercel.com)
2. Login dengan GitHub
3. Klik **"Add New..."** → **"Project"**
4. Import repository **"cardiocare"**
5. Klik **"Import"**

**Configure Project:**
```
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

**Environment Variables:**
Tambahkan variable:
```
Name: VITE_API_URL
Value: https://your_username.pythonanywhere.com
```

6. Klik **"Deploy"**
7. Tunggu 2-3 menit

### 2.4 Selesai! 🎉

Frontend live di: `https://cardiocare-xxx.vercel.app`
Backend live di: `https://your_username.pythonanywhere.com`

---

## 🧪 Testing

1. Buka URL Vercel Anda
2. Isi form prediksi
3. Klik "Lihat Hasil Prediksi"
4. Jika berhasil, Anda akan melihat hasil prediksi! ✅

---

## 🔧 Troubleshooting

### ❌ Error: "No module named 'flask'"

**Solusi:**
```bash
# Di Bash console PythonAnywhere
workon cardiocare-env
cd ~/cardiocare/backend
pip install -r requirements.txt
```

### ❌ Error: "Internal Server Error"

**Solusi:**
1. Di PythonAnywhere, klik **"Web"** tab
2. Klik **"Log files"** → **"Error log"**
3. Lihat error message di bagian bawah
4. Biasanya karena path yang salah di WSGI file

### ❌ Error: CORS Policy

**Solusi:**
Edit `backend/app.py`, pastikan CORS sudah benar:
```python
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow semua domain (testing)
```

Lalu reload web app di PythonAnywhere.

### ❌ Frontend tidak bisa connect ke backend

**Cek:**
1. Pastikan backend URL di `.env.production` benar
2. Test backend langsung: `https://your_username.pythonanywhere.com/predict`
3. Cek browser console (F12) untuk error message

---

## 📊 Limits PythonAnywhere Free Tier

✅ **Allowed:**
- 1 Web app
- 512 MB disk space
- Daily CPU time limit
- HTTPS included
- Custom domain (dengan upgrade)

⚠️ **Restrictions:**
- Tidak bisa akses website eksternal dari code (kecuali whitelist)
- Scheduled tasks terbatas

Untuk project Anda, limits ini **lebih dari cukup**! 🎉

---

## 🔄 Update Code (Cara Deploy Ulang)

**Jika ada perubahan di backend:**

1. Push ke GitHub
2. Di PythonAnywhere Bash console:
   ```bash
   cd ~/cardiocare
   git pull origin main
   ```
3. Reload web app di tab **"Web"**

**Jika ada perubahan di frontend:**
1. Push ke GitHub
2. Vercel otomatis deploy ulang! ✨

---

## 🎉 Selesai!

Aplikasi Anda sekarang **LIVE** dan bisa diakses dari mana saja!

**URLs:**
- Frontend: `https://cardiocare-xxx.vercel.app`
- Backend API: `https://your_username.pythonanywhere.com`

**Share link Vercel Anda untuk demo! 🚀**

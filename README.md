# CardioCare AI - Web Prediksi Hipertensi

Web prediksi risiko hipertensi menggunakan Machine Learning (XGBoost) dengan antarmuka modern dan user-friendly.

## 🏗️ Struktur Project

```
Web Hipertensi/
├── backend/                    # Flask API Server
│   ├── app.py                 # Main API endpoint
│   ├── hypertension_model.json # Model XGBoost terlatih
│   └── requirements.txt       # Python dependencies
└── frontend/                  # React + Vite aplikasi web
    ├── app.jsx               # Main React component
    ├── main.jsx              # React entry point
    ├── index.html            # HTML template
    ├── index.css             # Global styles
    ├── package.json          # Node dependencies
    ├── vite.config.js        # Vite configuration
    ├── tailwind.config.js    # Tailwind CSS config
    └── postcss.config.js     # PostCSS config
```

## 🚀 Cara Menjalankan Aplikasi

### 1️⃣ Setup Backend (Flask)

```powershell
# Masuk ke folder backend
cd backend

# Buat virtual environment (opsional tapi direkomendasikan)
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Jalankan server Flask
python app.py
```

Server akan berjalan di: **http://localhost:5000**

### 2️⃣ Setup Frontend (React + Vite)

Buka terminal baru:

```powershell
# Masuk ke folder frontend
cd frontend

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Aplikasi akan berjalan di: **http://localhost:5173**

## 📊 Fitur Aplikasi

### Input Data Pasien (3 Step Form):

**Step 1 - Profil Dasar:**
- Jenis Kelamin (Pria/Wanita)
- Usia
- Status Perokok (Ya/Tidak)
- Jumlah rokok per hari (jika perokok)

**Step 2 - Fisik & Riwayat:**
- BMI (Kurus/Normal/Gemuk/Obesitas)
- Detak Jantung (opsional, default: 75 bpm)
- Konsumsi obat tekanan darah (Ya/Tidak)
- Riwayat diabetes (Ya/Tidak)

**Step 3 - Hasil Lab:**
- Tekanan Sistolik (Normal/Peningkatan/Hipertensi 1/Hipertensi 2/Krisis)
- Tekanan Diastolik (Normal/Hipertensi 1/Hipertensi 2/Krisis)
- Gula Darah (Normal/Pre-Diabetes/Diabetes)
- Kolesterol Total (Normal/Ambang Batas/Tinggi)

### Output Prediksi:
- Status Risiko (Berisiko/Risiko Rendah)
- Probabilitas Risiko (dalam persen)
- Rekomendasi tindakan

## 🎨 Teknologi yang Digunakan

**Backend:**
- Flask (Python web framework)
- XGBoost (Machine Learning model)
- Flask-CORS (Cross-origin resource sharing)
- NumPy (Numerical computing)

**Frontend:**
- React 18 (UI framework)
- Vite (Build tool)
- Tailwind CSS (Styling)
- Lucide React (Icons)

## 📋 Mapping Kategori ke Nilai

### BMI
- Kurus: 17.0
- Normal: 22.0
- Gemuk: 27.5
- Obesitas: 32.0

### Gula Darah
- Normal: 85.0 mg/dL
- Pre-Diabetes: 112.0 mg/dL
- Diabetes: 150.0 mg/dL

### Kolesterol Total
- Normal: 180.0 mg/dL
- Ambang Batas: 220.0 mg/dL
- Tinggi: 260.0 mg/dL

### Tekanan Sistolik
- Normal: 110.0 mmHg
- Peningkatan: 125.0 mmHg
- Hipertensi 1: 135.0 mmHg
- Hipertensi 2: 160.0 mmHg
- Krisis: 190.0 mmHg

### Tekanan Diastolik
- Normal: 70.0 mmHg
- Hipertensi 1: 85.0 mmHg
- Hipertensi 2: 100.0 mmHg
- Krisis: 125.0 mmHg

## 🔧 Troubleshooting

**Backend tidak jalan:**
- Pastikan Python terinstall (versi 3.8+)
- Pastikan file `hypertension_model.json` ada di folder backend
- Cek apakah port 5000 tidak digunakan aplikasi lain

**Frontend tidak jalan:**
- Pastikan Node.js terinstall (versi 16+)
- Jalankan `npm install` terlebih dahulu
- Cek apakah port 5173 tidak digunakan aplikasi lain

**CORS Error:**
- Pastikan backend berjalan di port 5000
- Pastikan frontend berjalan di port 5173
- Flask-CORS sudah diaktifkan di `app.py`

## 📝 Catatan Penting

- Model sudah dilatih dan disimpan dalam format JSON
- Semua preprocessing dilakukan di backend
- Frontend hanya mengirim kategori string ke backend
- Backend mengkonversi kategori ke nilai numerik sesuai mapping
- Aplikasi ini untuk tujuan edukasi, bukan pengganti konsultasi medis

## 🎯 Cara Penggunaan

1. Jalankan backend terlebih dahulu
2. Jalankan frontend
3. Buka browser ke http://localhost:5173
4. Isi form sesuai kondisi kesehatan Anda
5. Klik "Lihat Hasil Prediksi"
6. Lihat hasil dan rekomendasi

---

**Dibuat dengan ❤️ untuk Lomba Web Hipertensi**

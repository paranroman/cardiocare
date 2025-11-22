# 🚀 QUICK DEPLOYMENT CHECKLIST

## ✅ STEP 1: Backend ke PythonAnywhere (15 menit)

1. [ ] Buat akun di pythonanywhere.com (Beginner/Free)
2. [ ] Upload backend via Git:
   ```bash
   git clone https://github.com/paranroman/cardiocare.git
   cd cardiocare/backend
   ```
3. [ ] Setup virtual environment:
   ```bash
   mkvirtualenv --python=/usr/bin/python3.10 cardiocare-env
   pip install -r requirements.txt
   ```
4. [ ] Add Web App: Manual config → Python 3.10
5. [ ] Edit WSGI file (ganti your_username 2x)
6. [ ] Set Working Directory: `/home/your_username/cardiocare/backend`
7. [ ] Reload web app
8. [ ] Catat URL: `https://your_username.pythonanywhere.com`

---

## ✅ STEP 2: Frontend ke Vercel (5 menit)

1. [ ] Update `frontend/.env.production`:
   ```
   VITE_API_URL=https://your_username.pythonanywhere.com
   ```
2. [ ] Push ke GitHub:
   ```powershell
   git add .
   git commit -m "Ready for production"
   git push origin main
   ```
3. [ ] Login vercel.com dengan GitHub
4. [ ] Import repository "cardiocare"
5. [ ] Configure:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. [ ] Add Environment Variable:
   - `VITE_API_URL` = `https://your_username.pythonanywhere.com`
7. [ ] Deploy!

---

## 🎯 URLs Result

- ✅ Frontend: `https://cardiocare-xxx.vercel.app`
- ✅ Backend: `https://your_username.pythonanywhere.com`

---

## 🆘 Quick Troubleshooting

**Backend error?** 
→ Cek Error Log di PythonAnywhere Web tab

**CORS error?**
→ Pastikan CORS di app.py sudah benar

**Frontend tidak connect?**
→ Cek console browser (F12) untuk error message

---

**Baca DEPLOY_PYTHONANYWHERE.md untuk panduan lengkap!**
